create table "public"."settings" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "graph_time" time with time zone not null default '10:00:00+00'::time with time zone,
    "email_notifications" boolean not null default true,
    "telegram_notifications" boolean not null default true
);

alter table "public"."settings" enable row level security;

CREATE UNIQUE INDEX settings_pkey ON public.settings USING btree (user_id);

alter table "public"."settings" add constraint "settings_pkey" PRIMARY KEY using index "settings_pkey";

alter table "public"."settings" add constraint "public_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."settings" validate constraint "public_settings_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$begin
  insert into public.profiles (id, email, first_name, last_name, currency, language_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    (new.raw_user_meta_data ->> 'currency')::currency_type,
    new.raw_user_meta_data ->> 'language_code'
  );
  insert into public.settings (user_id) values (new.id);
  return new;
end;$function$
;

grant delete on table "public"."settings" to "anon";

grant insert on table "public"."settings" to "anon";

grant references on table "public"."settings" to "anon";

grant select on table "public"."settings" to "anon";

grant trigger on table "public"."settings" to "anon";

grant truncate on table "public"."settings" to "anon";

grant update on table "public"."settings" to "anon";

grant delete on table "public"."settings" to "authenticated";

grant insert on table "public"."settings" to "authenticated";

grant references on table "public"."settings" to "authenticated";

grant select on table "public"."settings" to "authenticated";

grant trigger on table "public"."settings" to "authenticated";

grant truncate on table "public"."settings" to "authenticated";

grant update on table "public"."settings" to "authenticated";

grant delete on table "public"."settings" to "service_role";

grant insert on table "public"."settings" to "service_role";

grant references on table "public"."settings" to "service_role";

grant select on table "public"."settings" to "service_role";

grant trigger on table "public"."settings" to "service_role";

grant truncate on table "public"."settings" to "service_role";

grant update on table "public"."settings" to "service_role";

create policy "Select for owner"
on "public"."settings"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Update for owner"
on "public"."settings"
as permissive
for update
to public
using ((auth.uid() = user_id));

insert into settings (user_id) select id from profiles;