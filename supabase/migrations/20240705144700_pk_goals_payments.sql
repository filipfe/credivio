alter table "public"."goals_payments" drop constraint "goals_payments_pkey";

drop index if exists "public"."goals_payments_pkey";

alter table "public"."goals_payments" drop column "id";

alter table "public"."goals_payments" alter column "date" set default now();

CREATE UNIQUE INDEX goals_payments_pkey ON public.goals_payments USING btree (goal_id, date);

alter table "public"."goals_payments" add constraint "goals_payments_pkey" PRIMARY KEY using index "goals_payments_pkey";