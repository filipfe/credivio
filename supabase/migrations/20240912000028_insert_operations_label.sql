drop function if exists "public"."actions_insert_operations"(p_operations jsonb, p_user_id uuid, p_type operation_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.actions_insert_operations(p_operations jsonb, p_user_id uuid, p_type operation_type DEFAULT NULL::operation_type, p_label text DEFAULT NULL::text)        
 RETURNS uuid[]
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  obj jsonb;
  operation_type public.operation_type;
  new_ids uuid[];
  new_id uuid;
begin
  new_ids := array[]::uuid[];

  for obj in select * from jsonb_array_elements(p_operations)
  loop
    operation_type := coalesce(p_type, (obj->>'type')::public.operation_type);

    if operation_type = 'income' then
      insert into public.incomes (
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
        (obj->>'currency')::public.currency_type,
        (obj->>'amount')::numeric,
        coalesce((obj->>'issued_at')::timestamptz, now()),
        coalesce((obj->>'from_telegram')::boolean, false),
        obj->>'doc_path'
      ) returning id into new_id;
      elsif operation_type = 'expense' then
        insert into public.expenses (
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
          (obj->>'currency')::public.currency_type,
          (obj->>'amount')::numeric,
          coalesce((obj->>'issued_at')::timestamptz, now()),
          coalesce((obj->>'from_telegram')::boolean, false),
          coalesce(p_label, obj->>'label'),
          obj->>'doc_path'
        ) returning id into new_id;
      end if;

      new_ids := array_append(new_ids, new_id);
  end loop;

  return new_ids;
end;
$function$
;