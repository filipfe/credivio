drop function if exists "public"."get_stats_balance_history"(p_currency currency_type, p_month integer, p_year integer);

alter table "public"."profiles" alter column "last_name" set not null;
set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_stats_balance_history(p_currency currency_type, p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE), p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE))
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
    c1.date = o.issued_at::date and
    p_currency = o.currency
  group by c1.date
  order by c1.date;
end;
$function$
;