alter table "public"."profiles" add column telegram_id bigint;

alter table "public"."profiles" add column "first_name" text;

alter table "public"."profiles" add column "last_name" text;

alter table "public"."profiles" add column "email" text;

alter table "public"."profiles" add column "telegram_token" uuid not null default gen_random_uuid();

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.email);
  return new;
end;
$$;

alter policy "Enable update for users based on email"
on "public"."profiles"
to public
using ( auth.uid() = id )
with check ( auth.uid() = id );

alter policy "Enable update for users based on email"
on "public"."profiles" rename to "Enable update for owners";

alter table "public"."incomes" add column "from_telegram" boolean not null default false;
alter table "public"."expenses" add column "from_telegram" boolean not null default false;

create or replace view "public"."operations" with (security_invoker=on) as  SELECT incomes.id,
    incomes.user_id,
    incomes.title,
    incomes.description,
    incomes.amount,
    incomes.currency,
    'income'::operation_type AS type,
    incomes.recurring,
    incomes.issued_at,
    incomes.created_at,
    incomes.from_telegram
   FROM incomes
UNION ALL
 SELECT expenses.id,
    expenses.user_id,
    expenses.title,
    expenses.description,
    expenses.amount,
    expenses.currency,
    'expense'::operation_type AS type,
    expenses.recurring,
    expenses.issued_at,
    expenses.created_at,
    expenses.from_telegram
   FROM expenses;