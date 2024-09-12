create type "public"."period_type" as enum ('daily', 'weekly', 'monthly');

create table "public"."limits" (
    "user_id" uuid not null,
    "period" period_type not null,
    "amount" double precision not null,
    "currency" currency_type not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."limits" enable row level security;

CREATE UNIQUE INDEX limits_pkey ON public.limits USING btree (user_id, period);

alter table "public"."limits" add constraint "limits_pkey" PRIMARY KEY using index "limits_pkey";

alter table "public"."limits" add constraint "public_limits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."limits" validate constraint "public_limits_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_recurring_payments_active_payments(p_page integer DEFAULT 1)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select
      rp.id,
      rp.title,
      rp.type,
      rp.amount,
      rp.currency,
      rp.interval_unit,
      rp.interval_amount
    from public.recurring_payments rp
    order by rp.created_at desc
    limit 8 offset ($1 - 1) * 8
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'title', c1.title,
        'type', c1.type,
        'amount', c1.amount,
        'currency', c1.currency,
        'interval_unit', c1.interval_unit,
        'interval_amount', c1.interval_amount
      )),
      'count', (select count(*) from public.recurring_payments)
    )
  into result
  from cte1 c1;

  return result;
end;
$function$
;

grant delete on table "public"."limits" to "anon";

grant insert on table "public"."limits" to "anon";

grant references on table "public"."limits" to "anon";

grant select on table "public"."limits" to "anon";

grant trigger on table "public"."limits" to "anon";

grant truncate on table "public"."limits" to "anon";

grant update on table "public"."limits" to "anon";

grant delete on table "public"."limits" to "authenticated";

grant insert on table "public"."limits" to "authenticated";

grant references on table "public"."limits" to "authenticated";

grant select on table "public"."limits" to "authenticated";

grant trigger on table "public"."limits" to "authenticated";

grant truncate on table "public"."limits" to "authenticated";

grant update on table "public"."limits" to "authenticated";

grant delete on table "public"."limits" to "service_role";

grant insert on table "public"."limits" to "service_role";

grant references on table "public"."limits" to "service_role";

grant select on table "public"."limits" to "service_role";

grant trigger on table "public"."limits" to "service_role";

grant truncate on table "public"."limits" to "service_role";

grant update on table "public"."limits" to "service_role";

create policy "Access based on user id"
on "public"."limits"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));