create type "public"."interval_unit_type" as enum ('days', 'months', 'years');

alter table "public"."recurring_payments" alter column "interval_days" type smallint;

alter table "public"."recurring_payments" rename "interval_days" to "interval_amount";

alter table "public"."recurring_payments" add column "interval_unit" interval_unit_type;

update "public"."recurring_payments" set "interval_unit" = 'days';

alter table "public"."recurring_payments" alter column "interval_unit" set not null;

alter table "public"."recurring_payments" alter column "next_payment_date" drop default;

alter table "public"."recurring_payments" alter column "title" drop default;

set check_function_bodies = off;

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
    rp.next_payment_date,
    (
      case
        when rp.interval_unit = 'days' then rp.next_payment_date - interval '1 day' * rp.interval_amount
        when rp.interval_unit = 'months' then rp.next_payment_date - interval '1 month' * rp.interval_amount
        when rp.interval_unit = 'years' then rp.next_payment_date - interval '1 month' * rp.interval_amount
      end
    )::date as last_payment_date
  from recurring_payments rp
  order by next_payment_date desc;
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
      sum(amount) over (partition by
       extract(year from issued_at),
       extract(month from issued_at),
       currency
      ) as currency_total
    from operations
    where recurring = true
    offset $1
    limit 8
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
        'type', o.type
      )) as payments,
      jsonb_agg(distinct jsonb_build_object(
        'currency', o.currency,
        'total_amount', o.currency_total
      )) as total_amounts
    from operations_agg o
    group by o.year, o.month
    order by o.month desc
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
 RETURNS TABLE(id uuid, title text, type operation_type, amount double precision, currency currency_type, next_payment_date date)
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
      rp.next_payment_date,
      rp.interval_unit,
      rp.interval_amount,
      rp.next_payment_date as original_next_payment_date
    from recurring_payments rp
    where rp.next_payment_date between current_date and current_date  + interval '30 day'
    union all
    select
      up.id,
      up.title,
      up.type,
      up.amount,
      up.currency,
      (
        case
          when up.interval_unit = 'days' then up.next_payment_date + interval '1 day' * up.interval_amount
          when up.interval_unit = 'months' then up.next_payment_date + interval '1 month' * up.interval_amount
        end
      )::date,
      up.interval_unit,
      up.interval_amount,
      up.original_next_payment_date
    from upcoming_payments up
    where
      up.interval_unit in ('days', 'months')
      and (
        case
          when up.interval_unit = 'days' then up.next_payment_date + interval '1 day' * up.interval_amount
          when up.interval_unit = 'months' then up.next_payment_date + interval '1 month' * up.interval_amount
        end
      )::date between current_date and current_date  + interval '30 day'
  )
  select
    up.id,
    up.title,
    up.type,
    up.amount,
    up.currency,
    up.next_payment_date
  from upcoming_payments up
  order by up.next_payment_date;
end;
$function$
;