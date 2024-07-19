drop type "public"."dashboard_stat_type";

drop type "public"."dashboard_stats_type";

drop function if exists "public"."get_operations_stats"(p_currency currency_type, p_type operation_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_general_operations_stats(p_currency currency_type, p_type operation_type)
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