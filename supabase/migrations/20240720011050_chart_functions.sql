drop function if exists "public"."get_general_daily_total_amount"(p_currency currency_type, p_type text);

drop function if exists "public"."get_general_operations_stats"(p_currency currency_type, p_type operation_type);

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
    select
      c1.date,
      o.currency,
      coalesce((
        sum(
          case
            when o.type = 'income' then amount
            else -amount
          end
        )
      ), 0) as total_amount
    from cte1 c1
    left join operations o on
      c1.date = o.issued_at::date
      and ($1 is null or o.currency = $1)
    group by c1.date, o.currency
  )
  select
    c2.date,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'currency', currency,
          'amount', total_amount
        )
      ) filter (where currency is not null),
      '[]'::jsonb
    ) as total_amounts
  from cte2 c2
  group by c2.date
  order by c2.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_daily_totals(p_type operation_type, p_currency currency_type DEFAULT NULL::currency_type)
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      (current_date - interval '30 days')::date,
      current_date,
      interval '1 day'
    )::date as date
  ),
  cte2 as (
    select
      c1.date as date,
      o.currency,
      coalesce(sum(amount), 0) as total_amount
    from cte1 c1
    left join operations o on
      c1.date = o.issued_at::date
      and o.type = $1
      and ($2 is null or o.currency = $2)
    group by c1.date, o.currency
  )
  select
    c2.date,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'currency', currency,
          'amount', total_amount
        )
      ) filter (where currency is not null),
      '[]'::jsonb
    ) as total_amounts
  from cte2 c2
  group by c2.date
  order by c2.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_stats(p_currency currency_type, p_type operation_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$declare
  result record;
begin
  with data as (
    select
      sum(
        case
          when o.issued_at::date >= current_date - 30 then o.amount
          else 0
        end
      ) as current_total_30,
      sum(
        case
          when o.issued_at::date <= current_date - 31 then o.amount
          else 0
        end
      ) as latest_total_30,
      sum(
        case
          when o.issued_at::date = current_date then o.amount
          else 0
        end
      ) as current_total_1,
      sum(
        case
          when o.issued_at::date = current_date - 1 then o.amount
          else 0
        end
      ) as latest_total_1
    from operations o
    where o.currency = $1 and o.type = $2 and o.issued_at::date >= current_date - 61
  )
  select
    json_build_object(
      'amount', d.current_total_30,
      'difference', (
        case
          when d.latest_total_30 = 0 then 100
          else round((abs(d.current_total_30 - d.latest_total_30) / d.latest_total_30 * 100)::numeric, 2)
        end
      ),
      'difference_indicator',
        case
          when d.current_total_30 > d.latest_total_30 then 'positive'
          when d.current_total_30 < d.latest_total_30 then 'negative'
          else 'no_change'
        end
    ) as last_30_days,
    json_build_object(
      'amount', d.current_total_1,
      'difference', (
        case
          when d.latest_total_1 = 0 then 100
          else round((abs(d.current_total_1 - d.latest_total_1) / d.latest_total_1 * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_total_1 > d.latest_total_1 then 'positive'
        when d.current_total_1 < d.latest_total_1 then 'negative'
        else 'no_change'
      end
    ) as last_day
  into result
  from data d;
  return result;
end;$function$
;