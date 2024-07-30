set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_stocks_holdings(p_limit integer DEFAULT NULL::integer)
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
    having sum(case when transaction_type = 'buy' then quantity else -quantity end) > 0
    order by total_quantity desc
    limit p_limit
  )
  select json_object_agg(c1.symbol, c1.total_quantity) into result
  from cte1 c1;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_stocks_own_rows(p_limit integer DEFAULT 10, p_page integer DEFAULT 1, p_sort text DEFAULT NULL::text, p_search text DEFAULT NULL::text, p_transaction_type transaction_type DEFAULT NULL::transaction_type, p_currency currency_type DEFAULT NULL::currency_type, p_from date DEFAULT NULL::date, p_to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select
      id,
      symbol,
      transaction_type,
      quantity,
      price,
      value,
      currency,
      commission,
      issued_at::date
    from stocks
    where
      (p_search is null or symbol ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_transaction_type is null or transaction_type = p_transaction_type) and
      (p_from is null or issued_at::date >= p_from) and
      (p_to is null or issued_at::date <= p_to)
    order by
      case when p_sort is null then issued_at end desc,
      case when p_sort = 'issued_at' then issued_at end,
      case when p_sort = 'symbol' then symbol end,
      case when p_sort = 'transaction_type' then transaction_type end,
      case when p_sort = 'quantity' then quantity end,
      case when p_sort = 'price' then price end,
      case when p_sort = 'value' then value end,
      case when p_sort = 'currency' then currency end,
      case when p_sort = 'commission' then commission end,
      case when p_sort = '-issued_at' then issued_at end desc,
      case when p_sort = '-symbol' then symbol end desc,
      case when p_sort = '-transaction_type' then transaction_type end desc,
      case when p_sort = '-quantity' then quantity end desc,
      case when p_sort = '-price' then price end desc,
      case when p_sort = '-value' then value end desc,
      case when p_sort = '-currency' then currency end desc,
      case when p_sort = '-commission' then commission end desc,
      transaction_type desc,
      created_at desc,
      id
    limit p_limit offset (p_page - 1) * 10
  ),
  cte2 as (
    select count(*) as total_count
    from stocks
    where
      (p_search is null or symbol ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_transaction_type is null or transaction_type = p_transaction_type) and
      (p_from is null or issued_at::date >= p_from) and
      (p_to is null or issued_at::date <= p_to)
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'symbol', c1.symbol,
        'transaction_type', c1.transaction_type,
        'quantity', c1.quantity,
        'price', c1.price,
        'value', c1.value,
        'currency', c1.currency,
        'commission', c1.commission,
        'issued_at', c1.issued_at
      )),
      'count', (select total_count from cte2)
    ) as result
  into result
  from cte1 c1;

  return result;
end;
$function$
;