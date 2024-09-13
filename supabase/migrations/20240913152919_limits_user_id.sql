drop function if exists "public"."get_expenses_limits"();

drop function if exists "public"."get_expenses_limits"(p_currency currency_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_expenses_limits(p_currency currency_type, p_user_id uuid DEFAULT NULL::uuid)
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
    l.currency = e.currency and
    (
      (l.period = 'daily' and e.issued_at >= current_date) or
      (l.period = 'weekly' and e.issued_at >= date_trunc('week', current_date) + interval '0 day') or
      (l.period = 'monthly' and e.issued_at >= date_trunc('month', current_date))
    ) and
    ($2 is null or e.user_id = $2)
  where
    l.currency = $1
  group by
    l.period,
    l.amount;
end;
$function$
;