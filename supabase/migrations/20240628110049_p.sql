drop function if exists "public"."get_daily_total_amount"(currency currency_type, type text);

drop function if exists "public"."get_dashboard_chart_labels"(currency currency_type);

drop function if exists "public"."get_dashboard_stats"(currency currency_type);

drop function if exists "public"."get_operations_stats"(currency currency_type, type operation_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_daily_total_amount(p_currency currency_type, p_type text)
 RETURNS TABLE(date date, total_amount double precision)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  with daily_dates as (
    select generate_series(current_date - interval '30 day', current_date, interval '1 day')::date as date
  )
  select
    d.date as date,
    coalesce((
      case
        when $2 = 'budget' then sum(
          case
            when o.type = 'income' then amount
            else -amount
          end
        )
        else sum(amount)
      end
    ), 0) as total_amount
  from daily_dates d
  left join operations o on (
    case
      when $2 = 'budget' then d.date >= o.issued_at::date
      else d.date = o.issued_at::date
    end
  ) and
  o.currency = $1 and
  ($2 = 'budget' or o.type = $2::operation_type)
  group by d.date
  order by d.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_chart_labels(p_currency currency_type)
 RETURNS TABLE(name text, total_amount double precision)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
    label as name,
    sum(amount) as total_amount
  from expenses
  where
    currency = $1 and
    label is not null and
    issued_at >= current_date - 30
  group by label
  order by total_amount desc
  limit 4;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_currency currency_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
declare
  result record;
begin
  with data as (
    select
      sum(
        case
          when o.type = 'income' and o.issued_at >= current_date - 30 then o.amount
          else 0
        end
      ) as current_total_incomes,
      sum(
        case
          when o.type = 'expense' and o.issued_at >= current_date - 30 then o.amount
          else 0
        end
      ) as current_total_expenses,
      sum(
        case
          when o.type = 'income' then amount
          else -amount
        end
      ) as current_budget,
      sum(
        case
          when o.type = 'income' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount
          else 0
        end
      ) as latest_total_incomes,
      sum(
        case
          when o.type = 'expense' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount
          else 0
        end
      ) as latest_total_expenses,
      sum(
        case
          when o.issued_at <= current_date - 31 then
            case
              when o.type = 'income' then o.amount
              else -o.amount
            end
          else 0
        end
      ) as latest_budget
    from operations o
    where o.currency = $1
  )
  select
    json_build_object(
      'amount', d.current_total_incomes,
      'difference', (
        case
          when d.latest_total_incomes = 0 then 100
          else round((abs(d.current_total_incomes - d.latest_total_incomes) / d.latest_total_incomes * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_total_incomes > d.latest_total_incomes then 'positive'
        when d.current_total_incomes < d.latest_total_incomes  then 'negative'
        else 'no_change'
      end
    ) as incomes,
    json_build_object(
      'amount', d.current_total_expenses,
      'difference', (
        case
          when d.latest_total_expenses = 0 then 100
          else round((abs(d.current_total_expenses - d.latest_total_expenses) / d.latest_total_expenses * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_total_expenses > d.latest_total_expenses  then 'positive'
        when d.current_total_expenses < d.latest_total_expenses  then 'negative'
        else 'no_change'
      end
    ) as expenses,
    json_build_object(
      'amount', d.current_budget,
      'difference', (
        case
          when d.latest_budget = 0 then 100
          else round((abs(abs(d.current_budget - d.latest_budget) / d.latest_budget) * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when d.current_budget > d.latest_budget then 'positive'
        when d.current_budget < d.latest_budget then 'negative'
        else 'no_change'
      end
    ) as budget
  into result
  from data d;
  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_stats(p_currency currency_type, p_type operation_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
declare
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
end;
$function$
;