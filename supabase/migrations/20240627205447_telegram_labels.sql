set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_telegram_user_labels(p_user_id uuid)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
declare
  labels text[];
begin
  select array_agg(distinct label)
  into labels
  from expenses
  where user_id = $1 and label is not null;

  return labels;
end;
$function$
;