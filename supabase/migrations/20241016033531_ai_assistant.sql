set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_ai_assistant_operations(p_timezone text, p_currency currency_type, p_incomes boolean, p_expenses boolean, p_recurring_payments boolean)
 RETURNS TABLE(issued_at date, type text, title text, amount double precision, label text)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
  with cte1 as (
    select 
      (i.issued_at at time zone p_timezone)::date as issued_at,  
      'income' as type, 
      i.title,
      i.amount, 
      null::text as label
    from incomes i
    where 
      (i.issued_at at time zone p_timezone) >= (current_timestamp at time zone p_timezone)::date - interval '30 days' and
      i.currency = p_currency
    
    union all
    
    select 
      (e.issued_at at time zone p_timezone)::date as issued_at,
      'expense' as type, 
      e.title,
      e.amount, 
      e.label
    from expenses e
    where 
      (e.issued_at at time zone p_timezone) >= (current_timestamp at time zone p_timezone)::date - interval '30 days' and
      e.currency = p_currency 
    
    -- union all

    -- select rp.issued_at::date as transaction_date, 
    --        'recurring_payment' as type, 
    --        rp.amount, 
    --        null::text as label
    -- from recurring_payments rp
    -- where rp.issued_at >= current_date - interval '30 days'
  )
  
  select 
    c1.issued_at, 
    c1.type,
    c1.title,
    c1.amount, 
    c1.label
  from cte1 c1
  where 
    (p_incomes and c1.type = 'income') or
    (p_expenses and c1.type = 'expense')
    -- (p_recurring_payments and type = 'recurring_payment')
  order by c1.issued_at;
end;
$function$
;


