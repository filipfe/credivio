alter table "public"."incomes" alter column "created_at" set not null;

alter table "public"."incomes" alter column "issued_at" set default now();

alter table "public"."incomes" alter column "issued_at" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_operations(p_operations jsonb, p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    obj jsonb;
    operation_type text;
begin
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
          coalesce((obj->>'from_telegram')::BOOLEAN, false)
        );
        elsif operation_type = 'expense' then
          insert into expenses (
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
            coalesce((obj->>'from_telegram')::BOOLEAN, false)
          );
        end if;
    end loop;
end;
$function$
;