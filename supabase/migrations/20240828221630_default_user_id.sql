alter table "public"."expenses" alter column "user_id" set default auth.uid();

alter table "public"."goals" alter column "user_id" set default auth.uid();

alter table "public"."incomes" alter column "user_id" set default auth.uid();

alter table "public"."recurring_payments" alter column "user_id" set default auth.uid();

alter table "public"."user_services" alter column "user_id" set default auth.uid();