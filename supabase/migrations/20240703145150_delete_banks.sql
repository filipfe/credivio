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