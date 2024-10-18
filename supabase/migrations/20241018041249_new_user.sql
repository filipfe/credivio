set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  insert into settings (user_id, timezone, language) 
  values (
    new.id,
    new.raw_user_meta_data ->> 'timezone',
    new.raw_user_meta_data ->> 'language'
  );

  return new;
end;
$function$
;