set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_currency currency_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
declare
  result record;
begin
  with cte1 as (
    select
      sum(
        case
          when o.type = 'income' and date_trunc('month', o.issued_at) = date_trunc('month', current_date) then o.amount
          else 0
        end
      ) as current_month_incomes,
      sum(
        case
          when o.type = 'expense' and date_trunc('month', o.issued_at) = date_trunc('month', current_date) then o.amount
          else 0
        end
      ) as current_month_expenses,
      sum(
        case
          when o.type = 'income' and date_trunc('month', o.issued_at) = date_trunc('month', current_date - interval '1 month') then o.amount
          else 0
        end
      ) as last_month_incomes,
      sum(
        case
          when o.type = 'expense' and date_trunc('month', o.issued_at) = date_trunc('month', current_date - interval '1 month') then o.amount
          else 0
        end
      ) as last_month_expenses
    from operations o
    where
      o.currency = $1 and
      date_trunc('month', o.issued_at) >= date_trunc('month', current_date - interval '1 month')
  )
  select
    json_build_object(
      'amount', c1.current_month_incomes,
      'difference', (
        case
          when c1.last_month_incomes = 0 then
            case
              when c1.current_month_incomes = 0 then 0
              else 100
            end
          else round((abs(c1.current_month_incomes - c1.last_month_incomes) / c1.last_month_incomes * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when c1.current_month_incomes > c1.last_month_incomes then 'positive'
        when c1.current_month_incomes < c1.last_month_incomes  then 'negative'
        else 'no_change'
      end
    ) as incomes,
    json_build_object(
      'amount', c1.current_month_expenses,
      'difference', (
        case
          when c1.last_month_expenses = 0 then
            case
              when c1.current_month_expenses = 0 then 0
              else 100
            end
          else round((abs(c1.current_month_expenses - c1.last_month_expenses) / c1.last_month_expenses * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when c1.current_month_expenses > c1.last_month_expenses  then 'positive'
        when c1.current_month_expenses < c1.last_month_expenses  then 'negative'
        else 'no_change'
      end
    ) as expenses,
    json_build_object(
      'amount', c1.current_month_incomes - c1.current_month_expenses,
      'difference', (
        case
          when c1.last_month_incomes - c1.last_month_expenses = 0 then
            case
              when c1.current_month_incomes - c1.current_month_expenses = 0 then 0
              else 100
            end
          else round((abs(abs((c1.current_month_incomes - c1.current_month_expenses) - (c1.last_month_incomes - c1.last_month_expenses)) / (c1.last_month_incomes - c1.last_month_expenses)) * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when c1.current_month_incomes - c1.current_month_expenses > c1.last_month_incomes - c1.last_month_expenses then 'positive'
        when c1.current_month_incomes - c1.current_month_expenses < c1.last_month_incomes - c1.last_month_expenses then 'negative'
        else 'no_change'
      end
    ) as balance
  into result
  from cte1 c1;

  return result;
end;
$function$
;