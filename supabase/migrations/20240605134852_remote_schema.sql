drop view if exists "public"."operations";

alter table "public"."expenses" alter column "currency" drop default;

alter table "public"."expenses" alter column "currency" set data type currency_type using "currency"::currency_type;

alter table "public"."expenses" alter column "title" set not null;

alter table "public"."incomes" alter column "currency" drop default;

alter table "public"."incomes" alter column "currency" set data type currency_type using "currency"::currency_type;

alter table "public"."incomes" alter column "title" set not null;

alter table "public"."stocks" alter column "currency" set data type currency_type using "currency"::currency_type;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_portfolio_budgets()
 RETURNS TABLE(currency currency_type, budget numeric, difference numeric, difference_indicator text)
 LANGUAGE plpgsql
AS $function$begin
    return query 
    with budget_data as (
      select
          o.currency,
          sum(case when o.type = 'income' then o.amount else -o.amount end) as current_budget,
          sum(case 
              when o.type = 'income' and o.issued_at <= current_date - interval '31' day then o.amount
              when o.type = 'expense' and o.issued_at <= current_date - interval '31' day then -o.amount
              else 0
          end) as latest_budget
      from operations o
      group by o.currency
    )
    select
        bd.currency,
        bd.current_budget::numeric(10,2) as budget,
        (case 
            when bd.latest_budget = 0 then 100
            else abs(abs(bd.current_budget - bd.latest_budget) / bd.latest_budget) * 100
        end)::numeric(10,2) as difference,
        case 
            when bd.current_budget > bd.latest_budget then 'positive'
            when bd.current_budget < bd.latest_budget then 'negative'
            else 'no_change'
        end as difference_indicator
    from budget_data bd
    order by bd.current_budget desc;

end;$function$
;

CREATE OR REPLACE FUNCTION public.get_chart_labels(currency text)
 RETURNS TABLE(name text, total_amount double precision)
 LANGUAGE plpgsql
AS $function$begin
    return query 
    select
      e.label as name,
      sum(e.amount) as total_amount
    from expenses e
    where 
      e.currency = $1::currency_type and 
      e.label is not null and 
      e.issued_at >= current_date - 30
    group by e.label
    order by total_amount desc
    limit 4
    ;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_daily_total_amount(currency text, type text)
 RETURNS TABLE(date text, total_amount numeric)
 LANGUAGE plpgsql
AS $function$begin
  return query 
    with daily_dates as (
      select generate_series(current_date - interval '30 day', current_date, interval '1 day') as date
    )
    select
      to_char(d.date, 'dd-mm-yyyy') as date,
      COALESCE((case when $2 = 'budget' then
      sum(case when o.type = 'income' then amount else -amount end)::numeric(10,2) else sum(amount)::numeric(10,2) end
      )
        , 0) AS total_amount
    from daily_dates d
    left join operations o on (
      case when $2 = 'budget' then d.date >= date_trunc('day', o.issued_at) else d.date = date_trunc('day', o.issued_at) end
    )
      and o.currency = $1::currency_type
      and ($2 = 'budget' OR o.type = $2::operation_type)
    group by d.date
    order by d.date
  ;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(currency text)
 RETURNS record
 LANGUAGE plpgsql
AS $function$declare
  result record;
begin
    with data as (
      select
        sum(
          case 
            when o.type = 'income' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_expenses,
        sum(
          case 
            when o.type = 'income' then amount
            else -amount end
        ) as current_budget,
        sum(
          case 
            when o.type = 'income' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_incomes,
        sum(
          case 
            when o.type = 'expense' and o.issued_at <= current_date - 31 and o.issued_at >= current_date - 61 then o.amount 
            else 0 end
        ) as latest_total_expenses,
        sum(
          case 
            when o.issued_at <= current_date - 31 then
              case
                when o.type = 'income' then o.amount
                else -o.amount end
            else 0 end
        ) as latest_budget
      from operations o
      where o.currency = $1::currency_type
    )
    select
      json_build_object(
        'amount', d.current_total_incomes,
        'difference', case 
          when d.latest_total_incomes = 0 then 100
          else (abs(d.current_total_incomes - d.latest_total_incomes) / d.latest_total_incomes * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_incomes > d.latest_total_incomes then true else false end
      ) as incomes,
      json_build_object(
        'amount', d.current_total_expenses,
        'difference', case 
          when d.latest_total_expenses = 0 then 100
          else (abs(d.current_total_expenses - d.latest_total_expenses) / d.latest_total_expenses * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_expenses > d.latest_total_expenses then true else false end
      ) as expenses,
      json_build_object(
        'amount', d.current_budget,
        'difference', case 
          when d.latest_budget = 0 then 100
          else (abs((d.current_budget) - (d.latest_budget)) / abs(d.latest_budget) * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_budget > d.latest_budget then true else false end
      ) as budget 
    into result
    from data d;
    return result;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_stats(currency text, type text)
 RETURNS record
 LANGUAGE plpgsql
AS $function$declare
  result record;
begin
    with data as (
      select
        sum(
          case 
            when o.issued_at >= current_date - 30 then o.amount else 0 end
        ) as current_total_30,
        sum(
          case 
            when o.issued_at <= current_date - 31 then o.amount 
            else 0 end
        ) as latest_total_30,
        sum(
          case 
            when o.issued_at = current_date then o.amount else 0 end
        ) as current_total_1,
        sum(
          case 
            when o.issued_at = current_date - 1 then o.amount 
            else 0 end
        ) as latest_total_1
      from operations o
      where o.currency = $1::currency_type and o.type = $2::operation_type and o.issued_at >= current_date - 61
    )
    select
      json_build_object(
        'amount', d.current_total_30,
        'difference', case 
          when d.latest_total_30 = 0 then 100
        else (abs(d.current_total_30 - d.latest_total_30) / d.latest_total_30 * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_30 > d.latest_total_30 then true else false end
      ) as last_30_days,
      json_build_object(
        'amount', d.current_total_1,
        'difference', case 
          when d.latest_total_1 = 0 then 100
        else (abs(d.current_total_1 - d.latest_total_1) / d.latest_total_1 * 100)::numeric(10,2)
        end,
        'is_positive', case when d.current_total_1 > d.latest_total_1 then true else false end
      ) as last_day
    into result
    from data d;
    return result;
end;$function$
;

create or replace view "public"."operations" as  SELECT incomes.id,
    incomes.user_id,
    incomes.title,
    incomes.description,
    incomes.amount,
    incomes.currency,
    'income'::operation_type AS type,
    incomes.issued_at,
    incomes.created_at
   FROM incomes
UNION ALL
 SELECT expenses.id,
    expenses.user_id,
    expenses.title,
    expenses.description,
    expenses.amount,
    expenses.currency,
    'expense'::operation_type AS type,
    expenses.issued_at,
    expenses.created_at
   FROM expenses;



