alter table "public"."expenses" add column "doc_path" text;

alter table "public"."incomes" add column "doc_path" text;

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
    incomes.from_telegram,
    incomes.doc_path
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
    expenses.from_telegram,
    expenses.doc_path
   FROM expenses;

CREATE OR REPLACE FUNCTION public.actions_insert_operations(p_operations jsonb, p_user_id uuid)
 RETURNS uuid[]
 LANGUAGE plpgsql
AS $function$
declare
  obj jsonb;
  operation_type text;
  new_ids uuid[];
  new_id uuid;
begin
  new_ids := array[]::uuid[];

  for obj in select * from jsonb_array_elements(p_operations)
  loop
    operation_type := obj->>'type';

    if operation_type = 'income' then
      insert into incomes (
        user_id,
        title,
        currency,
        amount,
        issued_at,
        from_telegram,
        doc_path
      )
      values (
        p_user_id,
        obj->>'title',
        (obj->>'currency')::currency_type,
        (obj->>'amount')::numeric,
        coalesce((obj->>'issued_at')::timestamptz, now()),
        coalesce((obj->>'from_telegram')::boolean, false),
        obj->>'doc_path'
      ) returning id into new_id;
      elsif operation_type = 'expense' then
        insert into expenses (
          user_id,
          title,
          currency,
          amount,
          issued_at,
          from_telegram,
          label,
          doc_path
        )
        values (
          p_user_id,
          obj->>'title',
          (obj->>'currency')::currency_type,
          (obj->>'amount')::numeric,
          coalesce((obj->>'issued_at')::timestamptz, now()),
          coalesce((obj->>'from_telegram')::boolean, false),
          obj->>'label',
          obj->>'doc_path'
        ) returning id into new_id;
      end if;

      new_ids := array_append(new_ids, new_id);
  end loop;

  return new_ids;
end;
$function$
;