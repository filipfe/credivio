drop function if exists "public"."get_dashboard_portfolio_budgets"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_dashboard_chart_labels(p_currency currency_type)
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
    date_trunc('month', e.issued_at) = date_trunc('month', current_date)
  group by e.label
  order by total_amount desc
  limit 4;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_monthly_totals(p_currency currency_type DEFAULT NULL::currency_type, p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE), p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE))
 RETURNS TABLE(date date, total_amounts jsonb)
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
  ),
  cte2 as (
    select distinct o.currency
    from public.operations o
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
    left join public.operations o on
      c1.date = o.issued_at::date
      and c2.currency = o.currency
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

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_currency currency_type)
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
    date_trunc('month', o.issued_at) = date_trunc('month', current_date);

  return result;
end;
$function$
;

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
        'amount', rp.amount,
        'currency', rp.currency,
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