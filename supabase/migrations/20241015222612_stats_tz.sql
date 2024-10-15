drop function if exists "public"."get_stats_balance_history"(p_currency currency_type, p_month integer, p_year integer);

drop function if exists "public"."get_stats_data"(p_currency currency_type, p_month integer, p_year integer);

drop function if exists "public"."get_stats_expenses_by_label"(p_currency currency_type, p_month integer, p_year integer);

drop function if exists "public"."get_stats_operations_by_day_of_week"(p_currency currency_type, p_month integer, p_year integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_stats_balance_history(p_timezone text, p_currency currency_type, p_month integer, p_year integer)
 RETURNS TABLE(date date, total_incomes double precision, total_expenses double precision)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      date_trunc('month', make_date(p_year, p_month, 1)),
      (date_trunc('month', make_date(p_year, p_month, 1)) + interval '1 month - 1 day')::date,
      interval '1 day'
    )::date as date
  )
  select
    c1.date,
    coalesce(sum(case when o.type = 'income' then o.amount else 0 end), 0) as total_incomes,
    coalesce(sum(case when o.type = 'expense' then -o.amount else 0 end), 0) as total_expenses    
  from cte1 c1
  left join operations o on 
    c1.date = (o.issued_at at time zone p_timezone)::date and
    p_currency = o.currency
  group by c1.date
  order by c1.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_stats_data(p_timezone text, p_currency currency_type, p_month integer, p_year integer)
 RETURNS TABLE(date date, total_incomes double precision, total_expenses double precision)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      date_trunc('month', make_date(p_year, p_month, 1)),
      (date_trunc('month', make_date(p_year, p_month, 1)) + interval '1 month - 1 day')::date,
      interval '1 day'
    )::date as date
  )
  select
    c1.date,
    coalesce(sum(case when o.type = 'income' then o.amount end), 0) as total_incomes,
    coalesce(sum(case when o.type = 'expense' then o.amount end), 0) as total_expenses
  from cte1 c1
  left join public.operations o on
    ((o.issued_at at time zone p_timezone)::date between date_trunc('month', make_date(p_year, p_month, 1)) and c1.date) and
    o.currency = p_currency
  group by c1.date
  order by c1.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_stats_expenses_by_label(p_timezone text, p_currency currency_type, p_month integer, p_year integer)
 RETURNS TABLE(name text, total_amount double precision)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query 
  with cte1 as (
    select
      e.label as name,
      sum(e.amount) as total_amount
    from expenses e
    where 
      e.currency = p_currency and 
      e.label is not null and
      extract(month from (e.issued_at at time zone p_timezone)) = p_month and
      extract(year from (e.issued_at at time zone p_timezone)) = p_year
    group by e.label
    order by total_amount desc
    limit 5
  ),
  cte2 as (
    select
      '' as name,
      sum(e.amount) as total_amount
    from expenses e
    where 
      e.currency = p_currency and
      extract(month from (e.issued_at at time zone p_timezone)) = p_month and
      extract(year from (e.issued_at at time zone p_timezone)) = p_year and
      (e.label not in (select cte1.name from cte1) or e.label is null)
  )
  select * from cte1
  union all
  select * from cte2 c2 where c2.total_amount > 0;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_stats_operations_by_day_of_week(p_timezone text, p_currency currency_type, p_month integer, p_year integer)
 RETURNS TABLE(day_of_week integer, total_incomes bigint, total_expenses bigint)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query 
  with days as (
    select generate_series(0, 6) as day_of_week
  )
  select
    d.day_of_week,
    coalesce(count(case when o.type = 'income' then 1 end), 0) as total_incomes,
    coalesce(count(case when o.type = 'expense' then 1 end), 0) as total_expenses
  from days d
  left join operations o
    on cast(extract(dow from (o.issued_at at time zone p_timezone)) as integer) = d.day_of_week
    and o.currency = p_currency
    and extract(month from (o.issued_at at time zone p_timezone)) = p_month
    and extract(year from (o.issued_at at time zone p_timezone)) = p_year
  group by d.day_of_week
  order by d.day_of_week;
end;
$function$
;


