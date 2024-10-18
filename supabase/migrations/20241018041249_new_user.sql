set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  insert into public.settings (user_id, timezone, language) 
  values (
    new.id,
    new.raw_user_meta_data ->> 'timezone',
    new.raw_user_meta_data ->> 'language'
  );

  insert into stripe.customers (id, email, name)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'first_name' || ' ' || new.raw_user_meta_data ->> 'last_name'
  );

  return new;
end;
$function$
;