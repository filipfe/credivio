alter table "public"."incomes" alter column "created_at" set not null;

alter table "public"."incomes" alter column "issued_at" set default now();

alter table "public"."incomes" alter column "issued_at" set not null;

set check_function_bodies = off;

create or replace function insert_operations(p_operations jsonb, p_user_id uuid)
returns uuid[] as $$
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
      end if;

      new_ids := array_append(new_ids, new_id);
  end loop;

  return new_ids;
end;
$$ language plpgsql;

create or replace function delete_operations(p_ids uuid[])
returns jsonb as $$
declare
    result jsonb;
begin
  with deleted_expenses as (
    delete from expenses
    where id = any($1)
    returning title, currency, amount, 'expense' as type
  ),
  deleted_incomes as (
    delete from incomes
    where id = any($1)
    returning title, currency, amount, 'income' as type
  )
  select jsonb_agg(jsonb_build_object('title', title, 'currency', currency, 'amount', amount, 'type', type)) into result
  from (
    select title, currency, amount, type from deleted_expenses
    union all
    select title, currency, amount, type from deleted_incomes
  ) as combined_operations;

  return result;
end;
$$ language plpgsql;