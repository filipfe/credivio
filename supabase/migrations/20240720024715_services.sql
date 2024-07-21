set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_settings_subscription_services()
 RETURNS TABLE(id uuid, name text, href text, price double precision, title text, description text, is_active boolean)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
    s.id,
    s.name,
    s.href,
    s.price,
    s.title,
    s.description,
    exists (
      select 1
      from user_services us
      where us.service_id = s.id
    ) as is_active
  from services s
  order by is_active desc, name;
end;
$function$
;