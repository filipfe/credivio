
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

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";

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

CREATE TYPE "public"."interval_unit_type" AS ENUM (
    'day',
    'month',
    'year'
);

ALTER TYPE "public"."interval_unit_type" OWNER TO "postgres";

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

CREATE OR REPLACE FUNCTION "public"."actions_delete_operations"("p_ids" "uuid"[]) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$declare
    result jsonb;
begin
  with deleted_expenses as (
    delete from expenses
    where id = any($1)
    returning title, currency, amount, 'expense' as type
  ),
  deleted_incomes as (
    delete from incomes
    where id = any($1)
    returning title, currency, amount, 'income' as type
  )
  select jsonb_agg(jsonb_build_object('title', title, 'currency', currency, 'amount', amount, 'type', type)) into result
  from (
    select title, currency, amount, type from deleted_expenses
    union all
    select title, currency, amount, type from deleted_incomes
  ) as combined_operations;

  return result;
end;$_$;

ALTER FUNCTION "public"."actions_delete_operations"("p_ids" "uuid"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."actions_insert_operations"("p_operations" "jsonb", "p_user_id" "uuid") RETURNS "uuid"[]
    LANGUAGE "plpgsql"
    AS $$
declare
  obj jsonb;
  operation_type text;
  new_ids uuid[];
  new_id uuid;
begin
  new_ids := array[]::uuid[];

  for obj in select * from jsonb_array_elements(p_operations)
  loop
    operation_type := obj->>'type';

    if operation_type = 'income' then
      insert into incomes (
        user_id,
        title,
        currency,
        amount,
        issued_at,
        from_telegram,
        doc_path
      )
      values (
        p_user_id,
        obj->>'title',
        (obj->>'currency')::currency_type,
        (obj->>'amount')::numeric,
        coalesce((obj->>'issued_at')::timestamptz, now()),
        coalesce((obj->>'from_telegram')::boolean, false),
        obj->>'doc_path'
      ) returning id into new_id;
      elsif operation_type = 'expense' then
        insert into expenses (
          user_id,
          title,
          currency,
          amount,
          issued_at,
          from_telegram,
          label,
          doc_path
        )
        values (
          p_user_id,
          obj->>'title',
          (obj->>'currency')::currency_type,
          (obj->>'amount')::numeric,
          coalesce((obj->>'issued_at')::timestamptz, now()),
          coalesce((obj->>'from_telegram')::boolean, false),
          obj->>'label',
          obj->>'doc_path'
        ) returning id into new_id;
      end if;

      new_ids := array_append(new_ids, new_id);
  end loop;

  return new_ids;
end;
$$;

ALTER FUNCTION "public"."actions_insert_operations"("p_operations" "jsonb", "p_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."enforce_single_priority"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  if new.is_priority = true then
    update goals set is_priority = false where id <> new.id;
  end if;
  return new;
end;$$;

ALTER FUNCTION "public"."enforce_single_priority"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") RETURNS TABLE("date" "date", "total_amount" double precision)
    LANGUAGE "plpgsql"
    AS $_$
begin
  return query
  with daily_dates as (
    select generate_series(current_date - interval '30 day', current_date, interval '1 day')::date as date
  )
  select
    d.date as date,
    coalesce((
      case
        when $2 = 'budget' then sum(
          case
            when o.type = 'income' then amount
            else -amount
          end
        )
        else sum(amount)
      end
    ), 0) as total_amount
  from daily_dates d
  left join operations o on (
    case
      when $2 = 'budget' then d.date >= o.issued_at::date
      else d.date = o.issued_at::date
    end
  ) and
  o.currency = $1 and
  ($2 = 'budget' or o.type = $2::operation_type)
  group by d.date
  order by d.date;
end;
$_$;

ALTER FUNCTION "public"."get_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") RETURNS TABLE("name" "text", "total_amount" double precision)
    LANGUAGE "plpgsql"
    AS $_$
begin
  return query
  select
    label as name,
    sum(amount) as total_amount
  from expenses
  where
    currency = $1 and
    label is not null and
    issued_at >= current_date - 30
  group by label
  order by total_amount desc
  limit 4;
end;
$_$;

ALTER FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_portfolio_budgets"() RETURNS TABLE("currency" "public"."currency_type", "budget" numeric, "difference" numeric, "difference_indicator" "text")
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  with budget_data as (
    select
      o.currency,
      sum(
        case
          when o.type = 'income' then o.amount
          else -o.amount
        end
      ) as current_budget,
      sum(
        case
          when o.type = 'income' and o.issued_at <= current_date - interval '31 day' then o.amount
          when o.type = 'expense' and o.issued_at <= current_date - interval '31 day' then -o.amount
          else 0
        end
      ) as latest_budget
    from operations o
    group by o.currency
  )
  select
    bd.currency,
    round(bd.current_budget::numeric, 2) as budget,
    (
      case
        when bd.latest_budget = 0 then 100
        else round((abs(abs(bd.current_budget - bd.latest_budget) / bd.latest_budget) * 100)::numeric, 2)
      end
    ) as difference,
    (
      case
        when bd.current_budget > bd.latest_budget then 'positive'
        when bd.current_budget < bd.latest_budget then 'negative'
        else 'no_change'
      end
    ) as difference_indicator
  from budget_data bd
  order by bd.current_budget desc;
end;
$$;

ALTER FUNCTION "public"."get_dashboard_portfolio_budgets"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_dashboard_stats"("p_currency" "public"."currency_type") RETURNS "record"
    LANGUAGE "plpgsql"
    AS $_$
declare
  result record;
begin
  with data as (
    select
      sum(
        case
          when o.type = 'income' and o.issued_at >= current_date - 30 then o.amount
          else 0
        end
      ) as current_total_incomes,
      sum(
        case
          when o.type = 'expense' and o.issued_at >= current_date - 30 then o.amount
          else 0
        end
      ) as current_total_expenses,
      sum(
        case
          when o.type = 'income' then amount
          else -amount
        end
      ) as current_budget,
      sum(
        case
          when o.type = 'income' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount
          else 0
        end
      ) as latest_total_incomes,
      sum(
        case
          when o.type = 'expense' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount
          else 0
        end
      ) as latest_total_expenses,
      sum(
        case
          when o.issued_at <= current_date - 31 then
            case
              when o.type = 'income' then o.amount
              else -o.amount
            end
          else 0
        end
      ) as latest_budget
    from operations o
    where o.currency = $1
  )
  select
    json_build_object(
      'amount', d.current_total_incomes,
      'difference', (
        case
          when d.latest_total_incomes = 0 then 100
          else round((abs(d.current_total_incomes - d.latest_total_incomes) / d.latest_total_incomes * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_total_incomes > d.latest_total_incomes then 'positive'
        when d.current_total_incomes < d.latest_total_incomes  then 'negative'
        else 'no_change'
      end
    ) as incomes,
    json_build_object(
      'amount', d.current_total_expenses,
      'difference', (
        case
          when d.latest_total_expenses = 0 then 100
          else round((abs(d.current_total_expenses - d.latest_total_expenses) / d.latest_total_expenses * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_total_expenses > d.latest_total_expenses  then 'positive'
        when d.current_total_expenses < d.latest_total_expenses  then 'negative'
        else 'no_change'
      end
    ) as expenses,
    json_build_object(
      'amount', d.current_budget,
      'difference', (
        case
          when d.latest_budget = 0 then 100
          else round((abs(abs(d.current_budget - d.latest_budget) / d.latest_budget) * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_budget > d.latest_budget then 'positive'
        when d.current_budget < d.latest_budget then 'negative'
        else 'no_change'
      end
    ) as budget
  into result
  from data d;
  return result;
end;
$_$;

ALTER FUNCTION "public"."get_dashboard_stats"("p_currency" "public"."currency_type") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_expenses_own_rows"("p_page" integer DEFAULT 1, "p_sort" "text" DEFAULT NULL::"text", "p_label" "text" DEFAULT NULL::"text", "p_search" "text" DEFAULT NULL::"text", "p_currency" "public"."currency_type" DEFAULT NULL::"public"."currency_type") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
declare
  result jsonb;
begin
  with cte1 as (
    select
      id,
      title,
      amount,
      currency,
      label,
      issued_at::date,
      doc_path
    from
      expenses
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_label is null or label = p_label)
    order by
      case when p_sort is null then issued_at end desc,
      case when p_sort = 'issued_at' then issued_at end,
      case when p_sort = 'title' then title end,
      case when p_sort = 'amount' then amount end,
      case when p_sort = 'currency' then currency end,
      case when p_sort = 'label' then label end,
      case when p_sort = '-issued_at' then issued_at end desc,
      case when p_sort = '-title' then title end desc,
      case when p_sort = '-amount' then amount end desc,
      case when p_sort = '-currency' then currency end desc,
      case when p_sort = '-label' then label end desc,
      id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select
      count(*) as total_count
    from
      expenses
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_label is null or label = p_label)
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'title', c1.title,
        'amount', c1.amount,
        'currency', c1.currency,
        'label', c1.label,
        'issued_at', c1.issued_at,
        'doc_path', c1.doc_path
      )),
      'count', (select total_count from cte2)
    ) as result
  into result
  from
    cte1 c1;

  return result;
end;
$$;

ALTER FUNCTION "public"."get_expenses_own_rows"("p_page" integer, "p_sort" "text", "p_label" "text", "p_search" "text", "p_currency" "public"."currency_type") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_general_own_labels"() RETURNS TABLE("name" "text", "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select
    label as name,
    count(*)
  from expenses
  where label is not null
  group by label
  order by count(*) desc;
end;
$$;

ALTER FUNCTION "public"."get_general_own_labels"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_incomes_own_rows"("p_page" integer DEFAULT 1, "p_sort" "text" DEFAULT NULL::"text", "p_search" "text" DEFAULT NULL::"text", "p_currency" "public"."currency_type" DEFAULT NULL::"public"."currency_type") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
declare
  result jsonb;
begin
  with cte1 as (
    select
      id,
      title,
      amount,
      currency,
      issued_at::date,
      doc_path
    from
      incomes
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency)
    order by
      case when p_sort is null then issued_at end desc,
      case when p_sort = 'issued_at' then issued_at end,
      case when p_sort = 'title' then title end,
      case when p_sort = 'amount' then amount end,
      case when p_sort = 'currency' then currency end,
      case when p_sort = '-issued_at' then issued_at end desc,
      case when p_sort = '-title' then title end desc,
      case when p_sort = '-amount' then amount end desc,
      case when p_sort = '-currency' then currency end desc,
      id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select
      count(*) as total_count
    from
      incomes
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency)
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'title', c1.title,
        'amount', c1.amount,
        'currency', c1.currency,
        'issued_at', c1.issued_at,
        'doc_path', c1.doc_path
      )),
      'count', (select total_count from cte2)
    ) as result
  into result
  from
    cte1 c1;

  return result;
end;
$$;

ALTER FUNCTION "public"."get_incomes_own_rows"("p_page" integer, "p_sort" "text", "p_search" "text", "p_currency" "public"."currency_type") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_operations_stats"("p_currency" "public"."currency_type", "p_type" "public"."operation_type") RETURNS "record"
    LANGUAGE "plpgsql"
    AS $_$
declare
  result record;
begin
  with data as (
    select
      sum(
        case
          when o.issued_at::date >= current_date - 30 then o.amount
          else 0
        end
      ) as current_total_30,
      sum(
        case
          when o.issued_at::date <= current_date - 31 then o.amount
          else 0
        end
      ) as latest_total_30,
      sum(
        case
          when o.issued_at::date = current_date then o.amount
          else 0
        end
      ) as current_total_1,
      sum(
        case
          when o.issued_at::date = current_date - 1 then o.amount
          else 0
        end
      ) as latest_total_1
    from operations o
    where o.currency = $1 and o.type = $2 and o.issued_at::date >= current_date - 61
  )
  select
    json_build_object(
      'amount', d.current_total_30,
      'difference', (
        case
          when d.latest_total_30 = 0 then 100
          else round((abs(d.current_total_30 - d.latest_total_30) / d.latest_total_30 * 100)::numeric, 2)
        end
      ),
      'difference_indicator',
        case
          when d.current_total_30 > d.latest_total_30 then 'positive'
          when d.current_total_30 < d.latest_total_30 then 'negative'
          else 'no_change'
        end
    ) as last_30_days,
    json_build_object(
      'amount', d.current_total_1,
      'difference', (
        case
          when d.latest_total_1 = 0 then 100
          else round((abs(d.current_total_1 - d.latest_total_1) / d.latest_total_1 * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_total_1 > d.latest_total_1 then 'positive'
        when d.current_total_1 < d.latest_total_1 then 'negative'
        else 'no_change'
      end
    ) as last_day
  into result
  from data d;
  return result;
end;
$_$;

ALTER FUNCTION "public"."get_operations_stats"("p_currency" "public"."currency_type", "p_type" "public"."operation_type") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_recurring_payments_active_payments"() RETURNS TABLE("id" "uuid", "title" "text", "type" "public"."operation_type", "amount" double precision, "currency" "public"."currency_type", "interval_unit" "public"."interval_unit_type", "interval_amount" smallint, "next_payment_date" "date", "last_payment_date" "date")
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select
    rp.id,
    rp.title,
    rp.type,
    rp.amount,
    rp.currency,
    rp.interval_unit,
    rp.interval_amount,
    (rp.start_date + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval)::date as next_payment_date,
    (rp.start_date + (rp.interval_amount * (rp.counter - 1) || ' ' || rp.interval_unit)::interval)::date as last_payment_date
  from recurring_payments rp
  order by next_payment_date;
end;
$$;

ALTER FUNCTION "public"."get_recurring_payments_active_payments"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_recurring_payments_timeline_data"("p_offset" integer) RETURNS TABLE("year" numeric, "months" "jsonb")
    LANGUAGE "plpgsql"
    AS $_$
begin
  return query
  with operations_agg as (
    select
      extract(year from issued_at) as year,
      extract(month from issued_at) as month,
      id,
      title,
      amount,
      currency,
      type,
      issued_at,
      sum(
        case
          when type = 'expense' then -amount
          when type = 'income' then amount
        end
      ) over (partition by
        extract(year from issued_at),
        extract(month from issued_at),
        currency
      ) as currency_total
    from operations
    where recurring = true
    order by issued_at desc
    limit 8 offset $1
  ),
  monthly_data as (
    select
      o.year,
      o.month,
      jsonb_agg(jsonb_build_object(
        'id', o.id,
        'title', o.title,
        'amount', o.amount,
        'currency', o.currency,
        'type', o.type,
        'issued_at', o.issued_at
      )) as payments,
      jsonb_object_agg(o.currency, o.currency_total) as total_amounts
    from operations_agg o
    group by o.year, o.month
    order by o.year desc, o.month desc
  )
  select
    md.year,
    jsonb_agg(jsonb_build_object(
      'month', md.month,
      'payments', md.payments,
      'total_amounts', md.total_amounts
    )) as months
  from monthly_data md
  group by md.year
  order by md.year desc;
end;
$_$;

ALTER FUNCTION "public"."get_recurring_payments_timeline_data"("p_offset" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_recurring_payments_upcoming_payments"() RETURNS TABLE("id" "uuid", "title" "text", "type" "public"."operation_type", "amount" double precision, "currency" "public"."currency_type", "payment_date" "date")
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  with recursive upcoming_payments as (
    select
      rp.id,
      rp.title,
      rp.type,
      rp.amount,
      rp.currency,
      (rp.start_date + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval)::date as payment_date,
      rp.interval_unit,
      rp.interval_amount
    from recurring_payments rp
    where (
      rp.start_date + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval
    )::date between current_date and current_date  + interval '30 day'
    union all
    select
      up.id,
      up.title,
      up.type,
      up.amount,
      up.currency,
      (up.payment_date + (up.interval_amount || ' ' || up.interval_unit)::interval)::date,
      up.interval_unit,
      up.interval_amount
    from upcoming_payments up
    where
      up.interval_unit in ('day', 'month')
      and (
        up.payment_date + (up.interval_amount || ' ' || up.interval_unit)::interval
      )::date <= current_date + interval '30 day'
  )
  select
    up.id,
    up.title,
    up.type,
    up.amount,
    up.currency,
    up.payment_date
  from upcoming_payments up
  order by up.payment_date;
end;
$$;

ALTER FUNCTION "public"."get_recurring_payments_upcoming_payments"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_telegram_user_labels"("p_user_id" "uuid") RETURNS "text"[]
    LANGUAGE "plpgsql"
    AS $_$
declare
  labels text[];
begin
  select array_agg(distinct label)
  into labels
  from expenses
  where user_id = $1 and label is not null;

  return labels;
end;
$_$;

ALTER FUNCTION "public"."get_telegram_user_labels"("p_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$begin
  insert into public.profiles (id, email, first_name, last_name, currency, language_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    (new.raw_user_meta_data ->> 'currency')::currency_type,
    new.raw_user_meta_data ->> 'language_code'
  );
  return new;
end;$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."inactive_get_active_goals"() RETURNS TABLE("id" "uuid", "title" "text", "deadline" "date", "shortfall" numeric, "currency" "public"."currency_type", "days_left" integer)
    LANGUAGE "plpgsql"
    AS $$begin
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
end;$$;

ALTER FUNCTION "public"."inactive_get_active_goals"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "issued_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "amount" double precision NOT NULL,
    "description" "text",
    "currency" "public"."currency_type" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "label" "text",
    "recurring" boolean DEFAULT false NOT NULL,
    "from_telegram" boolean DEFAULT false NOT NULL,
    "doc_path" "text"
);

ALTER TABLE "public"."expenses" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."goals" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "currency" "public"."currency_type" NOT NULL,
    "price" double precision NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deadline" "date",
    "is_priority" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."goals" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."goals_payments" (
    "goal_id" "uuid" NOT NULL,
    "amount" double precision NOT NULL,
    "date" "date" DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."goals_payments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."incomes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "currency" "public"."currency_type" NOT NULL,
    "issued_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "amount" double precision NOT NULL,
    "recurring" boolean DEFAULT false NOT NULL,
    "from_telegram" boolean DEFAULT false NOT NULL,
    "doc_path" "text"
);

ALTER TABLE "public"."incomes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."languages" (
    "code" "text" NOT NULL,
    "name" "text" NOT NULL
);

ALTER TABLE "public"."languages" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."operations" WITH ("security_invoker"='on') AS
 SELECT "incomes"."id",
    "incomes"."user_id",
    "incomes"."title",
    "incomes"."description",
    "incomes"."amount",
    "incomes"."currency",
    'income'::"public"."operation_type" AS "type",
    "incomes"."recurring",
    "incomes"."issued_at",
    "incomes"."created_at",
    "incomes"."from_telegram",
    "incomes"."doc_path"
   FROM "public"."incomes"
UNION ALL
 SELECT "expenses"."id",
    "expenses"."user_id",
    "expenses"."title",
    "expenses"."description",
    "expenses"."amount",
    "expenses"."currency",
    'expense'::"public"."operation_type" AS "type",
    "expenses"."recurring",
    "expenses"."issued_at",
    "expenses"."created_at",
    "expenses"."from_telegram",
    "expenses"."doc_path"
   FROM "public"."expenses";

ALTER TABLE "public"."operations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "telegram_id" bigint,
    "first_name" "text" NOT NULL,
    "last_name" "text",
    "email" "text" NOT NULL,
    "telegram_token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "currency" "public"."currency_type" NOT NULL,
    "language_code" "text" NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recurring_payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "currency" "public"."currency_type" NOT NULL,
    "amount" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "interval_amount" smallint NOT NULL,
    "type" "public"."operation_type" NOT NULL,
    "interval_unit" "public"."interval_unit_type" NOT NULL,
    "counter" smallint DEFAULT '1'::smallint NOT NULL,
    "start_date" "date" NOT NULL
);

ALTER TABLE "public"."recurring_payments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."services" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "href" "text" NOT NULL,
    "price" double precision NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL
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
    "currency" "public"."currency_type" NOT NULL,
    "value" double precision NOT NULL,
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

ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."goals_payments"
    ADD CONSTRAINT "goals_payments_pkey" PRIMARY KEY ("goal_id", "date");

ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."incomes"
    ADD CONSTRAINT "incomes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_code_key" UNIQUE ("code");

ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("code");

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

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code");

ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "public_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."goals_payments"
    ADD CONSTRAINT "public_goals_payments_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON UPDATE CASCADE ON DELETE CASCADE;

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

CREATE POLICY "Access based on user id" ON "public"."expenses" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Access based on user id" ON "public"."goals" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Access based on user id" ON "public"."goals_payments" USING (("goal_id" IN ( SELECT "goals"."id"
   FROM "public"."goals"
  WHERE ("goals"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("goal_id" IN ( SELECT "goals"."id"
   FROM "public"."goals"
  WHERE ("goals"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));

CREATE POLICY "Access based on user id" ON "public"."incomes" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Access based on user id" ON "public"."profiles" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Access based on user id" ON "public"."recurring_payments" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Access based on user id" ON "public"."stocks" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Access based on user id" ON "public"."user_services" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable read access for all" ON "public"."languages" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."services" FOR SELECT USING (true);

ALTER TABLE "public"."expenses" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."goals" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."goals_payments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."incomes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;

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

GRANT ALL ON FUNCTION "public"."actions_delete_operations"("p_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."actions_delete_operations"("p_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."actions_delete_operations"("p_ids" "uuid"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."actions_insert_operations"("p_operations" "jsonb", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."actions_insert_operations"("p_operations" "jsonb", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."actions_insert_operations"("p_operations" "jsonb", "p_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."enforce_single_priority"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_single_priority"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_single_priority"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_portfolio_budgets"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_portfolio_budgets"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_portfolio_budgets"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("p_currency" "public"."currency_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("p_currency" "public"."currency_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("p_currency" "public"."currency_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_expenses_own_rows"("p_page" integer, "p_sort" "text", "p_label" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_expenses_own_rows"("p_page" integer, "p_sort" "text", "p_label" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_expenses_own_rows"("p_page" integer, "p_sort" "text", "p_label" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_general_own_labels"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_general_own_labels"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_general_own_labels"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_incomes_own_rows"("p_page" integer, "p_sort" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_incomes_own_rows"("p_page" integer, "p_sort" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_incomes_own_rows"("p_page" integer, "p_sort" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_operations_stats"("p_currency" "public"."currency_type", "p_type" "public"."operation_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_operations_stats"("p_currency" "public"."currency_type", "p_type" "public"."operation_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_operations_stats"("p_currency" "public"."currency_type", "p_type" "public"."operation_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_recurring_payments_active_payments"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_recurring_payments_active_payments"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recurring_payments_active_payments"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_recurring_payments_timeline_data"("p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_recurring_payments_timeline_data"("p_offset" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recurring_payments_timeline_data"("p_offset" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_recurring_payments_upcoming_payments"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_recurring_payments_upcoming_payments"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recurring_payments_upcoming_payments"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_telegram_user_labels"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_telegram_user_labels"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_telegram_user_labels"("p_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."inactive_get_active_goals"() TO "anon";
GRANT ALL ON FUNCTION "public"."inactive_get_active_goals"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."inactive_get_active_goals"() TO "service_role";

GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";

GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";

GRANT ALL ON TABLE "public"."goals_payments" TO "anon";
GRANT ALL ON TABLE "public"."goals_payments" TO "authenticated";
GRANT ALL ON TABLE "public"."goals_payments" TO "service_role";

GRANT ALL ON TABLE "public"."incomes" TO "anon";
GRANT ALL ON TABLE "public"."incomes" TO "authenticated";
GRANT ALL ON TABLE "public"."incomes" TO "service_role";

GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";

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

--
-- Dumped schema changes for auth and storage
--

ALTER FUNCTION "storage"."operation"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;

ALTER FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";

CREATE OR REPLACE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;

ALTER FUNCTION "storage"."update_updated_at_column"() OWNER TO "supabase_storage_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" "json",
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);

ALTER TABLE "auth"."audit_log_entries" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';

CREATE TABLE IF NOT EXISTS "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);

ALTER TABLE "auth"."flow_state" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';

CREATE TABLE IF NOT EXISTS "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "auth"."identities" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';

CREATE TABLE IF NOT EXISTS "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);

ALTER TABLE "auth"."instances" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';

CREATE TABLE IF NOT EXISTS "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);

ALTER TABLE "auth"."mfa_amr_claims" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';

CREATE TABLE IF NOT EXISTS "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL
);

ALTER TABLE "auth"."mfa_challenges" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';

CREATE TABLE IF NOT EXISTS "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text"
);

ALTER TABLE "auth"."mfa_factors" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';

CREATE TABLE IF NOT EXISTS "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);

ALTER TABLE "auth"."one_time_tokens" OWNER TO "supabase_auth_admin";

CREATE TABLE IF NOT EXISTS "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);

ALTER TABLE "auth"."refresh_tokens" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';

CREATE SEQUENCE IF NOT EXISTS "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "auth"."refresh_tokens_id_seq" OWNER TO "supabase_auth_admin";

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";

CREATE TABLE IF NOT EXISTS "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);

ALTER TABLE "auth"."saml_providers" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';

CREATE TABLE IF NOT EXISTS "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);

ALTER TABLE "auth"."saml_relay_states" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';

CREATE TABLE IF NOT EXISTS "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);

ALTER TABLE "auth"."schema_migrations" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';

CREATE TABLE IF NOT EXISTS "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text"
);

ALTER TABLE "auth"."sessions" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';

CREATE TABLE IF NOT EXISTS "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);

ALTER TABLE "auth"."sso_domains" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';

CREATE TABLE IF NOT EXISTS "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);

ALTER TABLE "auth"."sso_providers" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';

CREATE TABLE IF NOT EXISTS "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);

ALTER TABLE "auth"."users" OWNER TO "supabase_auth_admin";

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';

CREATE TABLE IF NOT EXISTS "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text"
);

ALTER TABLE "storage"."buckets" OWNER TO "supabase_storage_admin";

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';

CREATE TABLE IF NOT EXISTS "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "storage"."migrations" OWNER TO "supabase_storage_admin";

CREATE TABLE IF NOT EXISTS "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text"
);

ALTER TABLE "storage"."objects" OWNER TO "supabase_storage_admin";

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';

CREATE TABLE IF NOT EXISTS "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "storage"."s3_multipart_uploads" OWNER TO "supabase_storage_admin";

CREATE TABLE IF NOT EXISTS "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "storage"."s3_multipart_uploads_parts" OWNER TO "supabase_storage_admin";

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();

CREATE OR REPLACE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Give users access to own folder 1u7gb_0" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1u7gb_1" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1u7gb_2" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1u7gb_3" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "auth" TO "anon";
GRANT USAGE ON SCHEMA "auth" TO "authenticated";
GRANT USAGE ON SCHEMA "auth" TO "service_role";
GRANT ALL ON SCHEMA "auth" TO "supabase_auth_admin";
GRANT ALL ON SCHEMA "auth" TO "dashboard_user";
GRANT ALL ON SCHEMA "auth" TO "postgres";

GRANT ALL ON SCHEMA "storage" TO "postgres";
GRANT USAGE ON SCHEMA "storage" TO "anon";
GRANT USAGE ON SCHEMA "storage" TO "authenticated";
GRANT USAGE ON SCHEMA "storage" TO "service_role";
GRANT ALL ON SCHEMA "storage" TO "supabase_storage_admin";
GRANT ALL ON SCHEMA "storage" TO "dashboard_user";

GRANT ALL ON FUNCTION "auth"."email"() TO "dashboard_user";

GRANT ALL ON FUNCTION "auth"."jwt"() TO "postgres";
GRANT ALL ON FUNCTION "auth"."jwt"() TO "dashboard_user";

GRANT ALL ON FUNCTION "auth"."role"() TO "dashboard_user";

GRANT ALL ON FUNCTION "auth"."uid"() TO "dashboard_user";

GRANT ALL ON FUNCTION "storage"."operation"() TO "anon";
GRANT ALL ON FUNCTION "storage"."operation"() TO "authenticated";
GRANT ALL ON FUNCTION "storage"."operation"() TO "service_role";

GRANT ALL ON TABLE "auth"."audit_log_entries" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."audit_log_entries" TO "postgres";
GRANT SELECT ON TABLE "auth"."audit_log_entries" TO "postgres" WITH GRANT OPTION;

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."flow_state" TO "postgres";
GRANT SELECT ON TABLE "auth"."flow_state" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."flow_state" TO "dashboard_user";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."identities" TO "postgres";
GRANT SELECT ON TABLE "auth"."identities" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."identities" TO "dashboard_user";

GRANT ALL ON TABLE "auth"."instances" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."instances" TO "postgres";
GRANT SELECT ON TABLE "auth"."instances" TO "postgres" WITH GRANT OPTION;

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_amr_claims" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_amr_claims" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_amr_claims" TO "dashboard_user";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_challenges" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_challenges" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_challenges" TO "dashboard_user";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."mfa_factors" TO "postgres";
GRANT SELECT ON TABLE "auth"."mfa_factors" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."mfa_factors" TO "dashboard_user";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."one_time_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."one_time_tokens" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."one_time_tokens" TO "dashboard_user";

GRANT ALL ON TABLE "auth"."refresh_tokens" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."refresh_tokens" TO "postgres";
GRANT SELECT ON TABLE "auth"."refresh_tokens" TO "postgres" WITH GRANT OPTION;

GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "dashboard_user";
GRANT ALL ON SEQUENCE "auth"."refresh_tokens_id_seq" TO "postgres";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."saml_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_providers" TO "dashboard_user";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."saml_relay_states" TO "postgres";
GRANT SELECT ON TABLE "auth"."saml_relay_states" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."saml_relay_states" TO "dashboard_user";

GRANT ALL ON TABLE "auth"."schema_migrations" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."schema_migrations" TO "postgres";
GRANT SELECT ON TABLE "auth"."schema_migrations" TO "postgres" WITH GRANT OPTION;

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sessions" TO "postgres";
GRANT SELECT ON TABLE "auth"."sessions" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sessions" TO "dashboard_user";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sso_domains" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_domains" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_domains" TO "dashboard_user";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."sso_providers" TO "postgres";
GRANT SELECT ON TABLE "auth"."sso_providers" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "auth"."sso_providers" TO "dashboard_user";

GRANT ALL ON TABLE "auth"."users" TO "dashboard_user";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "auth"."users" TO "postgres";
GRANT SELECT ON TABLE "auth"."users" TO "postgres" WITH GRANT OPTION;

GRANT ALL ON TABLE "storage"."buckets" TO "anon";
GRANT ALL ON TABLE "storage"."buckets" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets" TO "postgres";

GRANT ALL ON TABLE "storage"."migrations" TO "anon";
GRANT ALL ON TABLE "storage"."migrations" TO "authenticated";
GRANT ALL ON TABLE "storage"."migrations" TO "service_role";
GRANT ALL ON TABLE "storage"."migrations" TO "postgres";

GRANT ALL ON TABLE "storage"."objects" TO "anon";
GRANT ALL ON TABLE "storage"."objects" TO "authenticated";
GRANT ALL ON TABLE "storage"."objects" TO "service_role";
GRANT ALL ON TABLE "storage"."objects" TO "postgres";

GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "anon";
GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "postgres";

GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "anon";
GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON SEQUENCES  TO "dashboard_user";

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON FUNCTIONS  TO "dashboard_user";

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_auth_admin" IN SCHEMA "auth" GRANT ALL ON TABLES  TO "dashboard_user";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
