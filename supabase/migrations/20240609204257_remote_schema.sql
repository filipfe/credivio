drop view if exists "public"."operations";

create or replace view "public"."operations" as  SELECT incomes.id,
    incomes.user_id,
    incomes.title,
    incomes.description,
    incomes.amount,
    incomes.currency,
    'income'::operation_type AS type,
    incomes.recurring,
    incomes.issued_at,
    incomes.created_at
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
    expenses.created_at
   FROM expenses;



