drop policy "Enable read access for all users" on "public"."banks";

revoke delete on table "public"."banks" from "anon";

revoke insert on table "public"."banks" from "anon";

revoke references on table "public"."banks" from "anon";

revoke select on table "public"."banks" from "anon";

revoke trigger on table "public"."banks" from "anon";

revoke truncate on table "public"."banks" from "anon";

revoke update on table "public"."banks" from "anon";

revoke delete on table "public"."banks" from "authenticated";

revoke insert on table "public"."banks" from "authenticated";

revoke references on table "public"."banks" from "authenticated";

revoke select on table "public"."banks" from "authenticated";

revoke trigger on table "public"."banks" from "authenticated";

revoke truncate on table "public"."banks" from "authenticated";

revoke update on table "public"."banks" from "authenticated";

revoke delete on table "public"."banks" from "service_role";

revoke insert on table "public"."banks" from "service_role";

revoke references on table "public"."banks" from "service_role";

revoke select on table "public"."banks" from "service_role";

revoke trigger on table "public"."banks" from "service_role";

revoke truncate on table "public"."banks" from "service_role";

revoke update on table "public"."banks" from "service_role";

alter table "public"."banks" drop constraint "banks_pkey";

drop index if exists "public"."banks_pkey";

drop table "public"."banks";

create table "public"."goals_payments" (
    "id" uuid not null default gen_random_uuid(),
    "goal_id" uuid not null,
    "amount" double precision not null,
    "date" date not null
);


alter table "public"."goals_payments" enable row level security;

alter table "public"."goals" drop column "saved";

CREATE UNIQUE INDEX goals_payments_pkey ON public.goals_payments USING btree (id);

alter table "public"."goals_payments" add constraint "goals_payments_pkey" PRIMARY KEY using index "goals_payments_pkey";

alter table "public"."goals_payments" add constraint "public_goals_payments_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES goals(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."goals_payments" validate constraint "public_goals_payments_goal_id_fkey";

grant delete on table "public"."goals_payments" to "anon";

grant insert on table "public"."goals_payments" to "anon";

grant references on table "public"."goals_payments" to "anon";

grant select on table "public"."goals_payments" to "anon";

grant trigger on table "public"."goals_payments" to "anon";

grant truncate on table "public"."goals_payments" to "anon";

grant update on table "public"."goals_payments" to "anon";

grant delete on table "public"."goals_payments" to "authenticated";

grant insert on table "public"."goals_payments" to "authenticated";

grant references on table "public"."goals_payments" to "authenticated";

grant select on table "public"."goals_payments" to "authenticated";

grant trigger on table "public"."goals_payments" to "authenticated";

grant truncate on table "public"."goals_payments" to "authenticated";

grant update on table "public"."goals_payments" to "authenticated";

grant delete on table "public"."goals_payments" to "service_role";

grant insert on table "public"."goals_payments" to "service_role";

grant references on table "public"."goals_payments" to "service_role";

grant select on table "public"."goals_payments" to "service_role";

grant trigger on table "public"."goals_payments" to "service_role";

grant truncate on table "public"."goals_payments" to "service_role";

grant update on table "public"."goals_payments" to "service_role";

create policy "Access based on user id"
on "public"."goals_payments"
as permissive
for all
to public
using ((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = ( SELECT auth.uid() AS uid)))))
with check ((goal_id IN ( SELECT goals.id
   FROM goals
  WHERE (goals.user_id = ( SELECT auth.uid() AS uid)))));