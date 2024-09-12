set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_dashboard_monthly_totals(p_currency currency_type DEFAULT NULL::currency_type, p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE), p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE))
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      date_trunc('month', make_date($2, $3, 1)),
      (date_trunc('month', make_date($2, $3, 1)) + interval '1 month - 1 day')::date,
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
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_daily_totals(p_type operation_type, p_currency currency_type DEFAULT NULL::currency_type)
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      (current_date - 30)::date,
      current_date,
      interval '1 day'
    )::date as date
  )
  select
    c1.date,
    coalesce(sum(o.amount), 0) as total_amount
  from cte1 c1
  left join public.operations o on
    o.issued_at::date = c1.date
    and o.type = $1
    and o.currency = $2
  group by c1.date
  order by c1.date;
end;
$function$
;