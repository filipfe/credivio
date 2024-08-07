drop function if exists "public"."get_daily_total_amount"(p_currency currency_type, p_type text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_general_daily_total_amount(p_currency currency_type, p_type text)
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  with daily_dates as (
    select generate_series(
      date_trunc('month', current_date),
      (date_trunc('month', current_date) + interval '1 month - 1 day')::date,
      interval '1 day'
    )::date as date
  )
  select
    d.date as date,
    coalesce((
      case
        when $2 = 'balance' then sum(
          case
            when o.type = 'income' then amount
            else -amount
          end
        )
        else sum(amount)
      end
    ), 0) as total_amount
  from daily_dates d
  left join operations o on
    d.date = o.issued_at::date and
    o.currency = $1 and
    ($2 = 'balance' or o.type = $2::operation_type)
  group by d.date
  order by d.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_chart_labels(p_currency currency_type)
 RETURNS TABLE(name text, total_amount double precision)
 LANGUAGE plpgsql
AS $function$begin
  return query
  select
    label as name,
    sum(amount) as total_amount
  from expenses
  where
    currency = $1 and
    label is not null and
    date_trunc('month', issued_at) = date_trunc('month', current_date)
  group by label
  order by total_amount desc
  limit 4;
end;$function$
;

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


