set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_operations_daily_totals(p_type operation_type, p_currency currency_type DEFAULT NULL::currency_type)
 RETURNS TABLE(date date, total_amounts jsonb)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      (current_date - 30)::date,
      current_date,
      interval '1 day'
    )::date as date
  ),
  cte2 as (
    select distinct o.currency
    from operations o
    where
      o.type = $1
      and ($2 is null or o.currency = $2)
      and o.issued_at >= current_date - 30
  ),
  cte3 as (
    select
      c1.date,
      c2.currency,
      coalesce(sum(o.amount), 0) as total_amount
    from cte1 c1
    cross join cte2 c2
    left join operations o on
      o.issued_at::date = c1.date
      and o.type = $1
      and o.currency = c2.currency
    group by c1.date, c2.currency
  )
  select
    c3.date,
    jsonb_agg(
      jsonb_build_object(
        'currency', c3.currency,
        'amount', c3.total_amount
      )
    ) as total_amounts
  from cte3 c3
  group by c3.date
  order by c3.date;
end;
$function$
;