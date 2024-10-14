drop function if exists "public"."get_expenses_limits"(p_currency currency_type, p_user_id uuid);

drop function if exists "public"."get_expenses_own_rows"(p_page integer, p_sort text, p_label text, p_search text, p_currency currency_type, p_from date, p_to date);

drop function if exists "public"."get_incomes_own_rows"(p_page integer, p_sort text, p_search text, p_currency currency_type, p_from date, p_to date);

drop function if exists "public"."get_operations_daily_totals"(p_type operation_type, p_currency currency_type);

drop function if exists "public"."get_operations_stats"(p_currency currency_type, p_type operation_type);

alter table "public"."settings" drop column "created_at";

alter table "public"."settings" add column "timezone" text not null default 'Europe/Warsaw';

alter table "public"."settings" alter column "timezone" drop default;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_dashboard_weekly_graph(p_timezone text, p_currency currency_type)
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query 
  with cte1 as (
    select generate_series(
      (date_trunc('week', (current_timestamp at time zone p_timezone))), 
      (date_trunc('week', (current_timestamp at time zone p_timezone)) + interval '6 days'),
      '1 day'::interval
    )::date as date
  )
  select
    c1.date,
    coalesce(sum(e.amount), 0) as total_amount
  from cte1 c1
  left join expenses e on 
    (e.issued_at at time zone p_timezone)::date = c1.date
    and e.currency = p_currency
  group by c1.date
  order by c1.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_expenses_own_rows(p_timezone text, p_page integer DEFAULT 1, p_sort text DEFAULT NULL::text, p_label text DEFAULT NULL::text, p_search text DEFAULT NULL::text, p_currency currency_type DEFAULT NULL::currency_type, p_from date DEFAULT NULL::date, p_to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select
      e.id, 
      e.title, 
      e.amount,     
      e.currency, 
      e.label,
      e.issued_at,
      e.doc_path
    from expenses e
    where
      (p_search is null or e.title ilike '%' || p_search || '%') and
      (p_currency is null or e.currency = p_currency) and
      (p_label is null or e.label = p_label) and
      (p_from is null or (e.issued_at at time zone p_timezone)::date >= p_from) and
      (p_to is null or (e.issued_at at time zone p_timezone)::date <= p_to)
    order by
      case when p_sort is null then e.issued_at end desc,
      case when p_sort = 'issued_at' then e.issued_at end,
      case when p_sort = 'title' then e.title end,
      case when p_sort = 'amount' then e.amount end,
      case when p_sort = 'currency' then e.currency end,
      case when p_sort = 'label' then e.label end,
      case when p_sort = '-issued_at' then e.issued_at end desc,
      case when p_sort = '-title' then e.title end desc,        
      case when p_sort = '-amount' then e.amount end desc,        
      case when p_sort = '-currency' then e.currency end desc,
      case when p_sort = '-label' then e.label end desc,
      e.issued_at desc,
      e.created_at desc,
      e.id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select count(*) as total_count
    from expenses e
    where
      (p_search is null or e.title ilike '%' || p_search || '%') and
      (p_currency is null or e.currency = p_currency) and
      (p_label is null or e.label = p_label) and
      (p_from is null or (e.issued_at at time zone p_timezone)::date >= p_from) and
      (p_to is null or (e.issued_at at time zone p_timezone)::date <= p_to)
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
  from cte1 c1;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_general_limits(p_timezone text, p_currency currency_type, p_user_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(period period_type, amount double precision, total double precision)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
  select
    l.period,
    l.amount,
    coalesce(sum(e.amount), 0) as total
  from
    limits l
  left join expenses e on 
    l.currency = e.currency and 
    (
      (l.period = 'daily' and (e.issued_at at time zone p_timezone) >= (current_timestamp at time zone p_timezone)::date) or
      (l.period = 'weekly' and (e.issued_at at time zone p_timezone) >= date_trunc('week', (current_timestamp at time zone p_timezone)::date)) or
      (l.period = 'monthly' and (e.issued_at at time zone p_timezone) >= date_trunc('month', (current_timestamp at time zone p_timezone)::date))
    ) and
    (p_user_id is null or e.user_id = p_user_id)
  where
    l.currency = p_currency
  group by
    l.period, 
    l.amount;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_incomes_own_rows(p_timezone text, p_page integer DEFAULT 1, p_sort text DEFAULT NULL::text, p_search text DEFAULT NULL::text, p_currency currency_type DEFAULT NULL::currency_type, p_from date DEFAULT NULL::date, p_to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select
      i.id, 
      i.title, 
      i.amount,     
      i.currency, 
      i.issued_at,
      i.doc_path
    from incomes i
    where
      (p_search is null or i.title ilike '%' || p_search || '%') and
      (p_currency is null or i.currency = p_currency) and
      (p_from is null or (i.issued_at at time zone p_timezone)::date >= p_from) and
      (p_to is null or (i.issued_at at time zone p_timezone)::date <= p_to)
    order by
      case when p_sort is null then i.issued_at end desc,
      case when p_sort = 'issued_at' then i.issued_at end,
      case when p_sort = 'title' then i.title end,
      case when p_sort = 'amount' then i.amount end,
      case when p_sort = 'currency' then i.currency end,
      case when p_sort = '-issued_at' then i.issued_at end desc,
      case when p_sort = '-title' then i.title end desc,        
      case when p_sort = '-amount' then i.amount end desc,        
      case when p_sort = '-currency' then i.currency end desc,
      i.issued_at desc,
      i.created_at desc,
      i.id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select count(*) as total_count
    from incomes i
    where
      (p_search is null or i.title ilike '%' || p_search || '%') and
      (p_currency is null or i.currency = p_currency) and
      (p_from is null or (i.issued_at at time zone p_timezone)::date >= p_from) and
      (p_to is null or (i.issued_at at time zone p_timezone)::date <= p_to)
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
  from cte1 c1;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_daily_totals(p_timezone text, p_currency currency_type, p_type operation_type)
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query 
  with cte1 as (
    select generate_series(
      (current_timestamp at time zone p_timezone)::date - 30,
      (current_timestamp at time zone p_timezone)::date,
      interval '1 day'
    )::date as date
  )
  select
    c1.date,
    coalesce(sum(o.amount), 0) as total_amount
  from cte1 c1
  left join operations o on 
    (o.issued_at at time zone p_timezone)::date = c1.date
    and o.type = p_type
    and o.currency = p_currency
  group by c1.date
  order by c1.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_stats(p_timezone text, p_currency currency_type, p_type operation_type)
 RETURNS record
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  result record;
begin
  with cte1 as (
    select
      coalesce(sum(case when (o.issued_at at time zone p_timezone) >= (current_timestamp at time zone p_timezone)::date - 30 then o.amount else 0 end), 0) as current_30_days_total,
      coalesce(sum(case when (o.issued_at at time zone p_timezone) >= (current_timestamp at time zone p_timezone)::date - 60 and (o.issued_at at time zone p_timezone) < (current_timestamp at time zone p_timezone)::date - 30 then o.amount else 0 end), 0) as last_30_days_total,
      coalesce(sum(case when (o.issued_at at time zone p_timezone)::date = (current_timestamp at time zone p_timezone)::date then o.amount else 0 end), 0) as current_day_total,
      coalesce(sum(case when (o.issued_at at time zone p_timezone)::date = (current_timestamp at time zone p_timezone)::date - 1 then o.amount else 0 end), 0) as last_day_total
    from operations o
    where 
      o.currency = p_currency and 
      o.type = p_type and 
      (o.issued_at at time zone p_timezone) >= (current_timestamp at time zone p_timezone)::date - 60
  )
  select
    json_build_object(
      'amount', c1.current_30_days_total,
      'difference', (
        case 
          when c1.last_30_days_total = 0 then
            case
              when c1.current_30_days_total = 0 then 0
              else 100
            end
          else round((abs(c1.current_30_days_total - c1.last_30_days_total) / c1.last_30_days_total * 100)::numeric, 2)
        end
      ),
      'difference_indicator', 
        case 
          when c1.current_30_days_total > c1.last_30_days_total then 'positive'
          when c1.current_30_days_total < c1.last_30_days_total then 'negative'
          else 'no_change'
        end
    ) as last_month,
    json_build_object(
      'amount', c1.current_day_total,
      'difference', (
        case 
          when c1.last_day_total = 0 then
            case
              when c1.current_day_total = 0 then 0
              else 100
            end
          else round((abs(c1.current_day_total - c1.last_day_total) / c1.last_day_total * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case 
        when c1.current_day_total > c1.last_day_total then 'positive'
        when c1.current_day_total < c1.last_day_total then 'negative'
        else 'no_change'
      end
    ) as last_day
  into result
  from cte1 c1;
  return result;
end;
$function$
;


