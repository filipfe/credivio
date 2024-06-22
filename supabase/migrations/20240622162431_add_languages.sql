alter table "public"."profiles" add column "currency" text;

create table "public"."languages" (
    "code" text not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
);

insert into languages 
(name, code) values
('Polski', 'pl-PL'),
('English', 'en-US');

alter table "public"."languages" enable row level security;

alter table "public"."profiles" add column "language_code" text not null default 'pl-PL';

alter table "public"."profiles" alter column "language_code" drop default;

CREATE UNIQUE INDEX languages_pkey ON public.languages USING btree (code);

alter table "public"."languages" add constraint "languages_pkey" PRIMARY KEY using index "languages_pkey";

alter table "public"."profiles" add constraint "profiles_language_code_fkey" FOREIGN KEY (language_code) REFERENCES languages(code) not valid;

alter table "public"."profiles" validate constraint "profiles_language_code_fkey";

grant delete on table "public"."languages" to "anon";

grant insert on table "public"."languages" to "anon";

grant references on table "public"."languages" to "anon";

grant select on table "public"."languages" to "anon";

grant trigger on table "public"."languages" to "anon";

grant truncate on table "public"."languages" to "anon";

grant update on table "public"."languages" to "anon";

grant delete on table "public"."languages" to "authenticated";

grant insert on table "public"."languages" to "authenticated";

grant references on table "public"."languages" to "authenticated";

grant select on table "public"."languages" to "authenticated";

grant trigger on table "public"."languages" to "authenticated";

grant truncate on table "public"."languages" to "authenticated";

grant update on table "public"."languages" to "authenticated";

grant delete on table "public"."languages" to "service_role";

grant insert on table "public"."languages" to "service_role";

grant references on table "public"."languages" to "service_role";

grant select on table "public"."languages" to "service_role";

grant trigger on table "public"."languages" to "service_role";

grant truncate on table "public"."languages" to "service_role";

grant update on table "public"."languages" to "service_role";

create policy "Enable read access for all"
on "public"."languages"
as permissive
for select
to public
using (true);

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, email, first_name, last_name, currency, language_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'currency',
    new.raw_user_meta_data ->> 'language_code'
  );
  return new;
end;
$$;