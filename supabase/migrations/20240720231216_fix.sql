set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_dashboard_monthly_totals(p_currency currency_type DEFAULT NULL::currency_type, p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE), p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE))
 RETURNS TABLE(date date, total_amounts jsonb)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      date_trunc('month', make_date($2, $3, 1)),
      (date_trunc('month', make_date($2, $3, 1)) + interval '1 month - 1 day')::date,
      interval '1 day'
    )::date as date
  ),
  cte2 as (
    select distinct o.currency
    from operations o
    where
      ($1 is null or o.currency = $1)
      and o.issued_at between
        date_trunc('month', make_date($2, $3, 1))
        and date_trunc('month', make_date($2, $3, 1)) + interval '1 month - 1 day'
  ),
  cte3 as (
    select
      c1.date,
      c2.currency,
      coalesce((
        sum(
          case
            when o.type = 'income' then o.amount
            else -o.amount
          end
        )
      ), 0) as total_amount
    from cte1 c1
    cross join cte2 c2
    left join operations o on
      c1.date = o.issued_at::date
      and ($1 is null or o.currency = $1)
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