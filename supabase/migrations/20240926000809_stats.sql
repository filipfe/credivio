drop function if exists "public"."get_dashboard_chart_labels"(p_currency currency_type);

drop function if exists "public"."get_dashboard_monthly_totals"(p_currency currency_type, p_year integer, p_month integer);

drop function if exists "public"."get_dashboard_stats"(p_currency currency_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_general_chart_labels(p_currency currency_type, p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE), p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE))
 RETURNS TABLE(name text, total_amount double precision)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  select
    e.label as name,
    sum(e.amount) as total_amount
  from public.expenses e
  where
    e.currency = $1 and
    e.label is not null and
    extract(month from e.issued_at) = $2 and
    extract(year from e.issued_at) = $3
  group by e.label
  order by total_amount desc
  limit 4;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_general_stats(p_currency currency_type, p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE), p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE))
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  result jsonb;
begin
  select
    jsonb_build_object(
      'incomes', coalesce(
        sum(case when o.type = 'income' then o.amount else 0 end)::numeric,
        0
      ),
      'expenses', coalesce(
        sum(case when o.type = 'expense' then o.amount else 0 end)::numeric,
        0
      ),
      'balance', coalesce(
        sum(case when o.type = 'income' then o.amount else 0 end)::numeric,
        0
      ) - coalesce(
        sum(case when o.type = 'expense' then o.amount else 0 end)::numeric,
        0
      )
    )
  into result
  from public.operations o
  where
    o.currency = $1 and
    extract(month from o.issued_at) = $2 and
    extract(year from o.issued_at) = $3;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_stats_balance_history(p_currency currency_type, p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE), p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE))
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
 SET search_path TO ''
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
    coalesce((
      sum(
        case
          when o.type = 'income' then o.amount
          else -o.amount
        end
      )
    ), 0) as total_amount
  from cte1 c1
  left join public.operations o on
    c1.date = o.issued_at::date and
    $1 = o.currency
  group by c1.date
  order by c1.date;
$function$
;