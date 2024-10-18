set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_stripe_customer()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
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


