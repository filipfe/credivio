drop function if exists "public"."get_recurring_payments_active_payments"();

drop function if exists "public"."get_recurring_payments_timeline_data"(p_offset integer);

alter type "public"."interval_unit_type" rename to "interval_unit_type__old_version_to_be_dropped";

create type "public"."interval_unit_type" as enum ('day', 'month', 'year', 'week');

alter table "public"."recurring_payments" alter column interval_unit type "public"."interval_unit_type" using interval_unit::text::"public"."interval_unit_type";

drop type "public"."interval_unit_type__old_version_to_be_dropped";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_active_payments(p_page integer DEFAULT 1)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  result jsonb;
begin
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', rp.id,
        'title', rp.title,
        'type', rp.type,
        'amount', rp.currency,
        'interval_unit', rp.interval_unit,
        'interval_amount', rp.interval_amount
      ) order by rp.created_at desc),
      'count', (select count(*) from public.recurring_payments)
    )
  into result
  from public.recurring_payments rp
  limit 8 offset ($1 - 1) * 8;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_upcoming_payments()
 RETURNS TABLE(id uuid, title text, type operation_type, amount double precision, currency currency_type, payment_date date)
 LANGUAGE plpgsql
 SET search_path TO ''
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
    from public.recurring_payments rp
    where (
      rp.start_date + ((rp.interval_amount * rp.counter) || ' ' || rp.interval_unit)::interval
    )::date between current_date and current_date  + interval '7 day'
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
      up.interval_unit in ('day', 'week')
      and (
        up.payment_date + (up.interval_amount || ' ' || up.interval_unit)::interval
      )::date <= current_date + interval '7 day'
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