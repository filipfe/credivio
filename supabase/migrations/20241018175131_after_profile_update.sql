alter table "public"."profiles" alter column "first_name" drop not null;

alter table "public"."profiles" alter column "last_name" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_stripe_customer()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'stripe'
AS $function$
begin
  if (new.email is distinct from old.email) or 
     (new.first_name is distinct from old.first_name) or
     (new.last_name is distinct from old.last_name) then

    update customers
    set 
      email = new.email,
      name = new.first_name || ' ' || new.last_name
    where id = new.id;

  end if;

  return new;
end;
$function$
;

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
  
  insert into stripe.customers (id, email)
  values (
    new.id, 
    new.email
  );

  return new;
end;
$function$
;

CREATE TRIGGER after_profile_update AFTER UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_stripe_customer();


