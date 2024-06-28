set check_function_bodies = off;

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
        from_telegram
      )
      values (
        p_user_id,
        obj->>'title',
        (obj->>'currency')::currency_type,
        (obj->>'amount')::numeric,
        coalesce((obj->>'issued_at')::timestamptz, now()),
        coalesce((obj->>'from_telegram')::boolean, false)
      ) returning id into new_id;
      elsif operation_type = 'expense' then
        insert into expenses (
          user_id,
          title,
          currency,
          amount,
          issued_at,
          from_telegram,
          label
        )
        values (
          p_user_id,
          obj->>'title',
          (obj->>'currency')::currency_type,
          (obj->>'amount')::numeric,
          coalesce((obj->>'issued_at')::timestamptz, now()),
          coalesce((obj->>'from_telegram')::boolean, false),
          obj->>'label'
        ) returning id into new_id;
      end if;

      new_ids := array_append(new_ids, new_id);
  end loop;

  return new_ids;
end;
$function$
;