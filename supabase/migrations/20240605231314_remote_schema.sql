create table "public"."result" (
    "json_build_object" json
);


set check_function_bodies = off;

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
        'difference', (case 
            when d.latest_total_incomes = 0 then 100
            else abs(abs(d.current_total_incomes - d.latest_total_incomes) / d.latest_total_incomes) * 100
        end)::numeric(10,2),
        'difference_indicator', case 
            when d.current_total_incomes > d.latest_total_incomes then 'positive'
            when d.current_total_incomes < d.latest_total_incomes  then 'negative'
            else 'no_change'
        end
      ) as incomes,
      json_build_object(
        'amount', d.current_total_expenses,
        'difference', (case 
            when d.latest_total_expenses = 0 then 100
            else abs(abs(d.current_total_expenses - d.latest_total_expenses) / d.latest_total_expenses) * 100
        end)::numeric(10,2),
        'difference_indicator', case 
            when d.current_total_expenses > d.latest_total_expenses  then 'positive'
            when d.current_total_expenses < d.latest_total_expenses  then 'negative'
            else 'no_change'
        end
      ) as expenses,
      json_build_object(
        'amount', d.current_budget,
        'difference', (case 
            when d.latest_budget = 0 then 100
            else abs(abs(d.current_budget - d.latest_budget) / d.latest_budget) * 100
        end)::numeric(10,2),
        'difference_indicator', case 
            when d.current_budget > d.latest_budget then 'positive'
            when d.current_budget < d.latest_budget then 'negative'
            else 'no_change'
        end
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
        'difference', (case 
            when d.latest_total_30 = 0 then 100
            else abs(d.current_total_30 - d.latest_total_30) / d.latest_total_30 * 100
        end)::numeric(10,2),
        'difference_indicator', case 
            when d.current_total_30 > d.latest_total_30 then 'positive'
            when d.current_total_30 < d.latest_total_30 then 'negative'
            else 'no_change'
        end
      ) as last_30_days,
      json_build_object(
        'amount', d.current_total_1,
        'difference', (case 
            when d.latest_total_1 = 0 then 100
            else abs(d.current_total_1 - d.latest_total_1) / d.latest_total_1 * 100
        end)::numeric(10,2),
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

grant delete on table "public"."result" to "anon";

grant insert on table "public"."result" to "anon";

grant references on table "public"."result" to "anon";

grant select on table "public"."result" to "anon";

grant trigger on table "public"."result" to "anon";

grant truncate on table "public"."result" to "anon";

grant update on table "public"."result" to "anon";

grant delete on table "public"."result" to "authenticated";

grant insert on table "public"."result" to "authenticated";

grant references on table "public"."result" to "authenticated";

grant select on table "public"."result" to "authenticated";

grant trigger on table "public"."result" to "authenticated";

grant truncate on table "public"."result" to "authenticated";

grant update on table "public"."result" to "authenticated";

grant delete on table "public"."result" to "service_role";

grant insert on table "public"."result" to "service_role";

grant references on table "public"."result" to "service_role";

grant select on table "public"."result" to "service_role";

grant trigger on table "public"."result" to "service_role";

grant truncate on table "public"."result" to "service_role";

grant update on table "public"."result" to "service_role";


