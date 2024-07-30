set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_operations_stats(p_currency currency_type, p_type operation_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
declare
  result record;
begin
  with cte1 as (
    select
      coalesce(sum(case when date_trunc('month', o.issued_at) = date_trunc('month', current_date) then o.amount else 0 end), 0) as current_month_total,
      coalesce(sum(case when date_trunc('month', o.issued_at) = date_trunc('month', current_date - interval '1 month') then o.amount else 0 end), 0) as last_month_total,
      coalesce(sum(case when o.issued_at::date = current_date then o.amount else 0 end), 0) as current_day_total,
      coalesce(sum(case when o.issued_at::date = current_date - 1 then o.amount else 0 end), 0) as last_day_total
    from operations o
    where
      o.currency = $1 and
      o.type = $2 and
      date_trunc('month', o.issued_at) >= date_trunc('month', current_date - interval '1 month')
  )
  select
    json_build_object(
      'amount', c1.current_month_total,
      'difference', (
        case
          when c1.last_month_total = 0 then
            case
              when c1.current_month_total = 0 then 0
              else 100
            end
          else round((abs(c1.current_month_total - c1.last_month_total) / c1.last_month_total * 100)::numeric, 2)
        end
      ),
      'difference_indicator',
        case
          when c1.current_month_total > c1.last_month_total then 'positive'
          when c1.current_month_total < c1.last_month_total then 'negative'
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