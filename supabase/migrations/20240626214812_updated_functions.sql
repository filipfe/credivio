drop function if exists "public"."delete_operations"(p_ids uuid[]);

drop function if exists "public"."get_active_goals"();

drop function if exists "public"."get_chart_labels"(currency text);

drop function if exists "public"."get_chart_labels_old"();

drop function if exists "public"."get_daily_total_amount"(currency text, type text);

drop function if exists "public"."get_dashboard_content"(user_id uuid);

drop function if exists "public"."get_dashboard_stats"(currency text);

drop function if exists "public"."get_dashboard_stats_old"();

drop function if exists "public"."get_dashboard_stats_old_v2"();

drop function if exists "public"."get_operations_stats"(currency text, type text);

drop function if exists "public"."get_own_labels"();

drop function if exists "public"."get_portfolio_budgets"();

drop function if exists "public"."insert_operations"(p_operations jsonb, p_user_id uuid);

drop function if exists "public"."get_recurring_payments_upcoming_payments"();

drop function if exists "public"."get_recurring_payments_active_payments"();

alter type "public"."interval_unit_type" rename to "interval_unit_type__old_version_to_be_dropped";

create type "public"."interval_unit_type" as enum ('day', 'month', 'year');

alter table "public"."recurring_payments" alter column interval_unit type "public"."interval_unit_type" using interval_unit::text::"public"."interval_unit_type";

drop type "public"."interval_unit_type__old_version_to_be_dropped";

alter table "public"."expenses" alter column "amount" drop default;

alter table "public"."expenses" alter column "issued_at" set default now();

alter table "public"."expenses" alter column "issued_at" set not null;

alter table "public"."incomes" alter column "amount" drop default;

alter table "public"."languages" drop column "created_at";

alter table "public"."profiles" alter column "currency" set not null;

alter table "public"."profiles" alter column "currency" set data type currency_type using "currency"::currency_type;

alter table "public"."profiles" alter column "email" set not null;

alter table "public"."profiles" alter column "first_name" set not null;

alter table "public"."recurring_payments" drop column "next_payment_date";

alter table "public"."recurring_payments" add column "counter" smallint not null default '1'::smallint;

alter table "public"."recurring_payments" add column "start_date" date not null;

alter table "public"."recurring_payments" alter column "interval_amount" drop default;

alter table "public"."recurring_payments" alter column "type" drop default;

alter table "public"."services" alter column "description" set not null;

alter table "public"."services" alter column "href" set not null;

alter table "public"."services" alter column "name" set not null;

alter table "public"."services" alter column "price" set not null;

alter table "public"."stocks" alter column "currency" set not null;

alter table "public"."stocks" alter column "value" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.actions_delete_operations(p_ids uuid[])
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$declare
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
end;$function$
;

CREATE OR REPLACE FUNCTION public.actions_insert_operations(p_operations jsonb, p_user_id uuid)
 RETURNS uuid[]
 LANGUAGE plpgsql
AS $function$declare
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
        from_telegram
      )
      values (
        p_user_id,
        obj->>'title',
        (obj->>'currency')::currency_type,
        (obj->>'amount')::numeric,
        coalesce((obj->>'issued_at')::timestamptz, now()),
        coalesce((obj->>'from_telegram')::boolean, false)
      ) returning id into new_id;
      elsif operation_type = 'expense' then
        insert into expenses (
          user_id,
          title,
          currency,
          amount,
          issued_at,
          from_telegram
        )
        values (
          p_user_id,
          obj->>'title',
          (obj->>'currency')::currency_type,
          (obj->>'amount')::numeric,
          coalesce((obj->>'issued_at')::timestamptz, now()),
          coalesce((obj->>'from_telegram')::boolean, false)
        ) returning id into new_id;
      end if;

      new_ids := array_append(new_ids, new_id);
  end loop;

  return new_ids;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_daily_total_amount(currency currency_type, type text)
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_chart_labels(currency currency_type)
 RETURNS TABLE(name text, total_amount double precision)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_portfolio_budgets()
 RETURNS TABLE(currency currency_type, budget numeric, difference numeric, difference_indicator text)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(currency currency_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_general_own_labels()
 RETURNS TABLE(name text, count bigint)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_stats(currency currency_type, type operation_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.inactive_get_active_goals()
 RETURNS TABLE(id uuid, title text, deadline date, shortfall numeric, currency currency_type, days_left integer)
 LANGUAGE plpgsql
AS $function$begin
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
end;$function$
;

CREATE OR REPLACE FUNCTION public.enforce_single_priority()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  if new.is_priority = true then
    update goals set is_priority = false where id <> new.id;
  end if;
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_active_payments()
 RETURNS TABLE(id uuid, title text, type operation_type, amount double precision, currency currency_type, interval_unit interval_unit_type, interval_amount smallint, next_payment_date date, last_payment_date date)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_timeline_data(p_offset integer)
 RETURNS TABLE(year numeric, months jsonb)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_upcoming_payments()
 RETURNS TABLE(id uuid, title text, type operation_type, amount double precision, currency currency_type, payment_date date)
 LANGUAGE plpgsql
AS $function$
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
$function$
;