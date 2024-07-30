drop function if exists "public"."get_dashboard_stats"(p_currency currency_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_currency currency_type)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  result jsonb;
begin
  select
    jsonb_build_object(
      'incomes', coalesce(sum(case when o.type = 'income' then o.amount else 0 end)::numeric, 0),
      'expenses', coalesce(sum(case when o.type = 'expense' then o.amount else 0 end)::numeric, 0),
      'balance', coalesce(sum(case when o.type = 'income' then o.amount else 0 end)::numeric, 0) - coalesce(sum(case when o.type = 'expense' then o.amount else 0 end)::numeric, 0)
    )
  into result
  from operations o
  where
    o.currency = $1 and
    date_trunc('month', o.issued_at) = date_trunc('month', current_date);

  return result;
end;
$function$
;