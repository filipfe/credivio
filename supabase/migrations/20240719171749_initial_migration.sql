
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

CREATE OR REPLACE FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") RETURNS TABLE("name" "text", "total_amount" double precision)
    LANGUAGE "plpgsql"
    AS $_$begin
  return query
  select
    label as name,
    sum(amount) as total_amount
  from expenses
  where
    currency = $1 and
    label is not null and
    date_trunc('month', issued_at) = date_trunc('month', current_date)
  group by label
  order by total_amount desc
  limit 4;
end;$_$;

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

CREATE OR REPLACE FUNCTION "public"."get_general_dashboard_stats"("p_currency" "public"."currency_type") RETURNS "record"
    LANGUAGE "plpgsql"
    AS $_$
declare
  result record;
begin
  with cte1 as (
    select
      sum(
        case
          when o.type = 'income' and date_trunc('month', o.issued_at) = date_trunc('month', current_date) then o.amount
          else 0
        end
      ) as current_month_incomes,
      sum(
        case
          when o.type = 'expense' and date_trunc('month', o.issued_at) = date_trunc('month', current_date) then o.amount
          else 0
        end
      ) as current_month_expenses,
      sum(
        case
          when o.type = 'income' and date_trunc('month', o.issued_at) = date_trunc('month', current_date - interval '1 month') then o.amount
          else 0
        end
      ) as last_month_incomes,
      sum(
        case
          when o.type = 'expense' and date_trunc('month', o.issued_at) = date_trunc('month', current_date - interval '1 month') then o.amount
          else 0
        end
      ) as last_month_expenses
    from operations o
    where
      o.currency = $1 and
      date_trunc('month', o.issued_at) >= date_trunc('month', current_date - interval '1 month')
  )
  select
    json_build_object(
      'amount', c1.current_month_incomes,
      'difference', (
        case
          when c1.last_month_incomes = 0 then
            case
              when c1.current_month_incomes = 0 then 0
              else 100
            end
          else round((abs(c1.current_month_incomes - c1.last_month_incomes) / c1.last_month_incomes * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when c1.current_month_incomes > c1.last_month_incomes then 'positive'
        when c1.current_month_incomes < c1.last_month_incomes  then 'negative'
        else 'no_change'
      end
    ) as incomes,
    json_build_object(
      'amount', c1.current_month_expenses,
      'difference', (
        case
          when c1.last_month_expenses = 0 then
            case
              when c1.current_month_expenses = 0 then 0
              else 100
            end
          else round((abs(c1.current_month_expenses - c1.last_month_expenses) / c1.last_month_expenses * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when c1.current_month_expenses > c1.last_month_expenses  then 'positive'
        when c1.current_month_expenses < c1.last_month_expenses  then 'negative'
        else 'no_change'
      end
    ) as expenses,
    json_build_object(
      'amount', c1.current_month_incomes - c1.current_month_expenses,
      'difference', (
        case
          when c1.last_month_incomes - c1.last_month_expenses = 0 then
            case
              when c1.current_month_incomes - c1.current_month_expenses = 0 then 0
              else 100
            end
          else round((abs(abs((c1.current_month_incomes - c1.current_month_expenses) - (c1.last_month_incomes - c1.last_month_expenses)) / (c1.last_month_incomes - c1.last_month_expenses)) * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when c1.current_month_incomes - c1.current_month_expenses > c1.last_month_incomes - c1.last_month_expenses then 'positive'
        when c1.current_month_incomes - c1.current_month_expenses < c1.last_month_incomes - c1.last_month_expenses then 'negative'
        else 'no_change'
      end
    ) as balance
  into result
  from cte1 c1;

  return result;
end;
$_$;

ALTER FUNCTION "public"."get_general_dashboard_stats"("p_currency" "public"."currency_type") OWNER TO "postgres";

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

CREATE OR REPLACE FUNCTION "public"."get_general_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") RETURNS TABLE("date" "date", "total_amount" double precision)
    LANGUAGE "plpgsql"
    AS $_$
begin
  return query
  with daily_dates as (
    select generate_series(
      date_trunc('month', current_date),
      (date_trunc('month', current_date) + interval '1 month - 1 day')::date,
      interval '1 day'
    )::date as date
  )
  select
    d.date as date,
    coalesce((
      case
        when $2 = 'balance' then sum(
          case
            when o.type = 'income' then amount
            else -amount
          end
        )
        else sum(amount)
      end
    ), 0) as total_amount
  from daily_dates d
  left join operations o on
    d.date = o.issued_at::date and
    o.currency = $1 and
    ($2 = 'balance' or o.type = $2::operation_type)
  group by d.date
  order by d.date;
end;
$_$;

ALTER FUNCTION "public"."get_general_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") OWNER TO "postgres";

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

GRANT ALL ON FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_chart_labels"("p_currency" "public"."currency_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_dashboard_portfolio_budgets"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_portfolio_budgets"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_portfolio_budgets"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_general_dashboard_stats"("p_currency" "public"."currency_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_general_dashboard_stats"("p_currency" "public"."currency_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_general_dashboard_stats"("p_currency" "public"."currency_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_expenses_own_rows"("p_page" integer, "p_sort" "text", "p_label" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_expenses_own_rows"("p_page" integer, "p_sort" "text", "p_label" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_expenses_own_rows"("p_page" integer, "p_sort" "text", "p_label" "text", "p_search" "text", "p_currency" "public"."currency_type") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_general_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_general_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_general_daily_total_amount"("p_currency" "public"."currency_type", "p_type" "text") TO "service_role";

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

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();

CREATE POLICY "Give users access to own folder 1u7gb_0" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1u7gb_1" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1u7gb_2" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

CREATE POLICY "Give users access to own folder 1u7gb_3" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'docs'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));

GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "postgres";
GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "postgres";
