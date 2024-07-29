set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_stocks_holdings()
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select
      symbol,
      sum(case when transaction_type = 'buy' then quantity else -quantity end) as total_quantity
    from stocks
    group by symbol
  )
  select json_object_agg(c1.symbol, c1.total_quantity) into result
  from cte1 c1;

  return result;
end;
$function$
;