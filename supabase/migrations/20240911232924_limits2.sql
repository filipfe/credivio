alter table "public"."limits" alter column "user_id" set default auth.uid();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_expenses_limits()
 RETURNS TABLE(period period_type, amount double precision, total double precision)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  select
    l.period,
    l.amount,
    coalesce(sum(e.amount), 0) as total
  from
    public.limits l
  left join public.expenses e on
    (l.period = 'daily' and e.issued_at >= current_date) or
    (l.period = 'weekly' and e.issued_at >= current_date - interval '7 days') or
    (l.period = 'monthly' and e.issued_at >= current_date - interval '1 month')
  group by
    l.period,
    l.amount;
end;
$function$
;