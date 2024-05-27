
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."currency_type" AS ENUM (
    'PLN',
    'USD',
    'EUR',
    'GBP',
    'CHF'
);

ALTER TYPE "public"."currency_type" OWNER TO "postgres";

CREATE TYPE "public"."dashboard_stat_type" AS (
	"amount" double precision,
	"difference" double precision
);

ALTER TYPE "public"."dashboard_stat_type" OWNER TO "postgres";

CREATE TYPE "public"."dashboard_stats_type" AS (
	"expenses" "public"."dashboard_stat_type",
	"incomes" "public"."dashboard_stat_type",
	"budget" "public"."dashboard_stat_type"
);

ALTER TYPE "public"."dashboard_stats_type" OWNER TO "postgres";

CREATE TYPE "public"."operation_type" AS ENUM (
    'income',
    'expense'
);

ALTER TYPE "public"."operation_type" OWNER TO "postgres";

CREATE TYPE "public"."transaction_type" AS ENUM (
    'buy',
    'sell'
);

ALTER TYPE "public"."transaction_type" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."enforce_single_priority"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- If the new row is setting is_priority to true
  IF NEW.is_priority = TRUE THEN
    -- Update all other rows to set is_priority to false
    UPDATE goals SET is_priority = FALSE WHERE id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."enforce_single_priority"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_active_goals"() RETURNS TABLE("id" "uuid", "title" "text", "deadline" "date", "shortfall" numeric, "currency" "public"."currency_type", "days_left" integer)
    LANGUAGE "plpgsql"
    AS $$

begin
  return query 
    select
      g.id,
      g.title,
      g.deadline,
      (g.price - g.saved)::numeric(10,2) as shortfall,
      g.currency,
      (g.deadline - current_date) as days_left
    from goals g
    where g.deadline >= current_date
    order by g.deadline, created_at
  ;
end;

$$;

ALTER FUNCTION "public"."get_active_goals"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_chart_labels"("currency" "text") RETURNS TABLE("name" "text", "total_amount" double precision)
    LANGUAGE "plpgsql"
    AS $_$
begin
    return query 
    select
      e.label as name,
      sum(e.amount) as total_amount
    from expenses e
    where 
      e.currency = $1 and 
      e.label is not null and 
      e.issued_at >= current_date - 30
    group by e.label
    order by total_amount desc
    limit 4
    ;
end;
$_$;

ALTER FUNCTION "public"."get_chart_labels"("currency" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_chart_labels_old"() RETURNS TABLE("name" "text", "total_amount" double precision)
    LANGUAGE "plpgsql"
    AS $$begin
    return query 
    select
      label as name,
      sum(amount) as total_amount
    from expenses
    where label is not null and issued_at >= current_date - 30
    group by label
    order by total_amount desc
    limit 4
    ;
end;$$;

ALTER FUNCTION "public"."get_chart_labels_old"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_daily_total_amount"("currency" "text", "type" "text") RETURNS TABLE("date" "text", "total_amount" numeric)
    LANGUAGE "plpgsql"
    AS $_$begin
  return query 
    with daily_dates as (
      select generate_series(current_date - interval '30 day', current_date, interval '1 day') as date
    )
    select
      to_char(d.date, 'dd-mm-yyyy') as date,
      COALESCE((case when $2 = 'budget' then
      sum(case when o.type = 'income' then amount else -amount end)::numeric(10,2) else sum(amount)::numeric(10,2) end
      )
        , 0) AS total_amount
    from daily_dates d
    left join operations o on (
      case when $2 = 'budget' then d.date >= date_trunc('day', o.issued_at) else d.date = date_trunc('day', o.issued_at) end
    )
      and o.currency = $1
      and ($2 = 'budget' OR o.type = $2)
    group by d.date
    order by d.date
  ;
end;$_$;

ALTER FUNCTION "public"."get_daily_total_amount"("currency" "text", "type" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_content"("user_id" "uuid") RETURNS TABLE("latest_operations" "json")
    LANGUAGE "plpgsql"
    AS $_$
begin
    return query 
      select
        json_agg(json_build_object(
            'title', operation.title,
            'amount', operation.amount,
            'issued_at', operation.issued_at,
            'description', operation.description,
            'currency', operation.currency,
            'type',
              case 
                when operation.source_table = 'expenses' 
                then 'expense'
                else 'income'
              end
        ) order by issued_at desc) latest_operations
      from profiles
      left join (
        select expenses.user_id, title, amount, issued_at, description, currency, 'expenses' as source_table from expenses
        union all
        select incomes.user_id, title, amount, issued_at, description, currency, 'incomes' as source_table from incomes
      ) operation on operation.user_id = profiles.id
      where profiles.id = $1
      limit 4
    ;
end;
$_$;

ALTER FUNCTION "public"."get_dashboard_content"("user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_stats"("currency" "text") RETURNS "record"
    LANGUAGE "plpgsql"
    AS $_$declare
  result record;
begin
    with data as (
      select
        sum(
          case 
            when o.type = 'income' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_expenses,
        sum(
          case 
            when o.type = 'income' then amount
            else -amount end
        ) as current_budget,
        sum(
          case 
            when o.type = 'income' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_expenses,
        sum(
          case 
            when o.issued_at <= current_date - 31 then
              case
                when o.type = 'income' then o.amount
                else -o.amount end
            else 0 end
        ) as latest_budget
      from operations o
      where o.currency = $1
    )
    select
      json_build_object(
        'amount', d.current_total_incomes,
        'difference', case 
          when d.latest_total_incomes = 0 then 100
          else (abs(d.current_total_incomes - d.latest_total_incomes) / d.latest_total_incomes * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_incomes > d.latest_total_incomes then true else false end
      ) as incomes,
      json_build_object(
        'amount', d.current_total_expenses,
        'difference', case 
          when d.latest_total_expenses = 0 then 100
          else (abs(d.current_total_expenses - d.latest_total_expenses) / d.latest_total_expenses * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_expenses > d.latest_total_expenses then true else false end
      ) as expenses,
      json_build_object(
        'amount', d.current_budget,
        'difference', case 
          when d.latest_budget = 0 then 100
          else (abs((d.current_budget) - (d.latest_budget)) / abs(d.latest_budget) * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_budget > d.latest_budget then true else false end
      ) as budget 
    into result
    from data d;
    return result;
end;$_$;

ALTER FUNCTION "public"."get_dashboard_stats"("currency" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_stats_old"() RETURNS SETOF "json"
    LANGUAGE "plpgsql"
    AS $$begin
  return query
    with data as (
      select
        sum(
          case 
            when o.type = 'income' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_expenses,
        sum(
          case 
            when o.type = 'income' then amount
            else -amount end
        ) as current_budget,
        sum(
          case 
            when o.type = 'income' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_expenses,
        sum(
          case 
            when o.issued_at <= current_date - 31 then
              case
                when o.type = 'income' then o.amount
                else -o.amount end
            else 0 end
        ) as latest_budget
      from operations o
    )
    select
      json_build_object(    
        'incomes', json_build_object(
          'amount', d.current_total_incomes,
          'difference', case 
            when d.latest_total_incomes = 0 then null
            else (abs(d.current_total_incomes - d.latest_total_incomes) / d.latest_total_incomes * 100)::numeric(10,2)
          end,
          'is_positive', case when d.current_total_incomes > d.latest_total_incomes then true else false end
        ),
        'expenses', json_build_object(
          'amount', d.current_total_expenses,
          'difference', case 
            when d.latest_total_expenses = 0 then null
            else (abs(d.current_total_expenses - d.latest_total_expenses) / d.latest_total_expenses * 100)::numeric(10,2)
          end,
          'is_positive', case when d.current_total_expenses > d.latest_total_expenses then true else false end
        ),
        'budget', json_build_object(
          'amount', d.current_budget,
          'difference', case 
            when d.latest_budget = 0 then null
            else (abs((d.current_budget) - (d.latest_budget)) / abs(d.latest_budget) * 100)::numeric(10,2)
          end,
          'is_positive', case when d.current_budget > d.latest_budget then true else false end
        )
      )
    from data d
  ;
end;$$;

ALTER FUNCTION "public"."get_dashboard_stats_old"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_stats_old_v2"() RETURNS "record"
    LANGUAGE "plpgsql"
    AS $$declare
  result record;
begin
    with data as (
      select
        sum(
          case 
            when o.type = 'income' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_expenses,
        sum(
          case 
            when o.type = 'income' then amount
            else -amount end
        ) as current_budget,
        sum(
          case 
            when o.type = 'income' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_expenses,
        sum(
          case 
            when o.issued_at <= current_date - 31 then
              case
                when o.type = 'income' then o.amount
                else -o.amount end
            else 0 end
        ) as latest_budget
      from operations o
      left join auth.users u on u.id = o.user_id
      where o.currency = u.raw_user_meta_data->>'currency'
    )
    select
      json_build_object(
        'amount', d.current_total_incomes,
        'difference', case 
          when d.latest_total_incomes = 0 then null
          else (abs(d.current_total_incomes - d.latest_total_incomes) / d.latest_total_incomes * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_incomes > d.latest_total_incomes then true else false end
      ) as incomes,
      json_build_object(
        'amount', d.current_total_expenses,
        'difference', case 
          when d.latest_total_expenses = 0 then null
          else (abs(d.current_total_expenses - d.latest_total_expenses) / d.latest_total_expenses * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_expenses > d.latest_total_expenses then true else false end
      ) as expenses,
      json_build_object(
        'amount', d.current_budget,
        'difference', case 
          when d.latest_budget = 0 then null
          else (abs((d.current_budget) - (d.latest_budget)) / abs(d.latest_budget) * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_budget > d.latest_budget then true else false end
      ) as budget 
    into result
    from data d;
    return result;
end;$$;

ALTER FUNCTION "public"."get_dashboard_stats_old_v2"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_operations_stats"("currency" "text", "type" "text") RETURNS "record"
    LANGUAGE "plpgsql"
    AS $_$declare
  result record;
begin
    with data as (
      select
        sum(
          case 
            when o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_30,
        sum(
          case 
            when o.issued_at <= current_date - 31 then o.amount 
            else 0 end
        ) as latest_total_30,
        sum(
          case 
            when o.issued_at = current_date then o.amount else 0 end
        ) as current_total_1,
        sum(
          case 
            when o.issued_at = current_date - 1 then o.amount 
            else 0 end
        ) as latest_total_1
      from operations o
      where o.currency = $1 and o.type = $2 and o.issued_at >= current_date - 61
    )
    select
      json_build_object(
        'amount', d.current_total_30,
        'difference', case 
          when d.latest_total_30 = 0 then 100
        else (abs(d.current_total_30 - d.latest_total_30) / d.latest_total_30 * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_30 > d.latest_total_30 then true else false end
      ) as last_30_days,
      json_build_object(
        'amount', d.current_total_1,
        'difference', case 
          when d.latest_total_1 = 0 then 100
        else (abs(d.current_total_1 - d.latest_total_1) / d.latest_total_1 * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_1 > d.latest_total_1 then true else false end
      ) as last_day
    into result
    from data d;
    return result;
end;$_$;

ALTER FUNCTION "public"."get_operations_stats"("currency" "text", "type" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_own_labels"() RETURNS TABLE("name" "text", "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin
    return query 
    select distinct
      label as name,
      count(*)
    from expenses
    where label is not null
    group by label
    order by count(*) desc
    ;
end;
$$;

ALTER FUNCTION "public"."get_own_labels"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."banks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL
);

ALTER TABLE "public"."banks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "issued_at" "date",
    "title" "text",
    "amount" double precision DEFAULT '0'::double precision NOT NULL,
    "description" "text",
    "currency" "text" DEFAULT ''::"text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "label" "text",
    "recurring" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."expenses" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."goals" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "currency" "public"."currency_type" NOT NULL,
    "saved" double precision DEFAULT '0'::double precision NOT NULL,
    "price" double precision NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deadline" "date",
    "is_priority" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."goals" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."incomes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text",
    "description" "text",
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "issued_at" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "amount" double precision DEFAULT '0'::double precision NOT NULL,
    "recurring" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."incomes" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."operations" WITH ("security_invoker"='on') AS
 SELECT "incomes"."id",
    "incomes"."user_id",
    "incomes"."title",
    "incomes"."description",
    "incomes"."amount",
    "incomes"."currency",
    'income'::"text" AS "type",
    "incomes"."issued_at",
    "incomes"."created_at"
   FROM "public"."incomes"
UNION ALL
 SELECT "expenses"."id",
    "expenses"."user_id",
    "expenses"."title",
    "expenses"."description",
    "expenses"."amount",
    "expenses"."currency",
    'expense'::"text" AS "type",
    "expenses"."issued_at",
    "expenses"."created_at"
   FROM "public"."expenses";

ALTER TABLE "public"."operations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recurring_payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "currency" "public"."currency_type" NOT NULL,
    "amount" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "interval_days" bigint DEFAULT '7'::bigint NOT NULL,
    "next_payment_date" "date" DEFAULT '2024-05-22'::"date" NOT NULL,
    "type" "public"."operation_type" DEFAULT 'expense'::"public"."operation_type" NOT NULL
);

ALTER TABLE "public"."recurring_payments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."services" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "href" "text",
    "price" double precision,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."services" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."stocks" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "symbol" "text" NOT NULL,
    "transaction_type" "public"."transaction_type" NOT NULL,
    "quantity" bigint NOT NULL,
    "price" double precision NOT NULL,
    "commission" double precision NOT NULL,
    "issued_at" "text" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "currency" "text",
    "value" double precision,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."stocks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_services" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "service_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_trial" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."user_services" OWNER TO "postgres";

ALTER TABLE ONLY "public"."banks"
    ADD CONSTRAINT "banks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."incomes"
    ADD CONSTRAINT "incomes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."recurring_payments"
    ADD CONSTRAINT "recurring_payments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."stocks"
    ADD CONSTRAINT "stocks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_services"
    ADD CONSTRAINT "user_services_pkey" PRIMARY KEY ("service_id", "user_id");

CREATE OR REPLACE TRIGGER "enforce_single_priority_trigger" BEFORE INSERT OR UPDATE OF "is_priority" ON "public"."goals" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_single_priority"();

ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "public_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "public_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."incomes"
    ADD CONSTRAINT "public_incomes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "public_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."stocks"
    ADD CONSTRAINT "public_stocks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_services"
    ADD CONSTRAINT "public_user_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_services"
    ADD CONSTRAINT "public_user_services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recurring_payments"
    ADD CONSTRAINT "recurring_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

CREATE POLICY "Access based on user id" ON "public"."user_services" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable CRUD for users based on their user id" ON "public"."goals" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."expenses" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."incomes" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."stocks" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."expenses" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."incomes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."stocks" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."banks" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."services" FOR SELECT USING (true);

CREATE POLICY "Enable read access for users based on user_id" ON "public"."expenses" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable read access for users based on user_id" ON "public"."incomes" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for users based on their user id" ON "public"."stocks" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for users based on user id" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));

CREATE POLICY "Enable select for users based on user_id" ON "public"."recurring_payments" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable update for users based on email" ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

ALTER TABLE "public"."banks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."expenses" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."goals" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."incomes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."recurring_payments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."stocks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_services" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."enforce_single_priority"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_single_priority"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_single_priority"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_active_goals"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_active_goals"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_active_goals"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_chart_labels"("currency" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_chart_labels"("currency" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_chart_labels"("currency" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_chart_labels_old"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_chart_labels_old"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_chart_labels_old"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_daily_total_amount"("currency" "text", "type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_daily_total_amount"("currency" "text", "type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_daily_total_amount"("currency" "text", "type" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_content"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_content"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_content"("user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("currency" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("currency" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("currency" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_stats_old"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats_old"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats_old"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_stats_old_v2"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats_old_v2"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats_old_v2"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_operations_stats"("currency" "text", "type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_operations_stats"("currency" "text", "type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_operations_stats"("currency" "text", "type" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_own_labels"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_own_labels"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_own_labels"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."banks" TO "anon";
GRANT ALL ON TABLE "public"."banks" TO "authenticated";
GRANT ALL ON TABLE "public"."banks" TO "service_role";

GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";

GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";

GRANT ALL ON TABLE "public"."incomes" TO "anon";
GRANT ALL ON TABLE "public"."incomes" TO "authenticated";
GRANT ALL ON TABLE "public"."incomes" TO "service_role";

GRANT ALL ON TABLE "public"."operations" TO "anon";
GRANT ALL ON TABLE "public"."operations" TO "authenticated";
GRANT ALL ON TABLE "public"."operations" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."recurring_payments" TO "anon";
GRANT ALL ON TABLE "public"."recurring_payments" TO "authenticated";
GRANT ALL ON TABLE "public"."recurring_payments" TO "service_role";

GRANT ALL ON TABLE "public"."services" TO "anon";
GRANT ALL ON TABLE "public"."services" TO "authenticated";
GRANT ALL ON TABLE "public"."services" TO "service_role";

GRANT ALL ON TABLE "public"."stocks" TO "anon";
GRANT ALL ON TABLE "public"."stocks" TO "authenticated";
GRANT ALL ON TABLE "public"."stocks" TO "service_role";

GRANT ALL ON TABLE "public"."user_services" TO "anon";
GRANT ALL ON TABLE "public"."user_services" TO "authenticated";
GRANT ALL ON TABLE "public"."user_services" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
