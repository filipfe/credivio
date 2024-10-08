set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_expenses_own_rows(p_page integer DEFAULT 1, p_sort text DEFAULT NULL::text, p_label text DEFAULT NULL::text, p_search text DEFAULT NULL::text, p_currency currency_type DEFAULT NULL::currency_type, p_from date DEFAULT NULL::date, p_to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select
      id,
      title,
      amount,
      currency,
      label,
      issued_at::date,
      doc_path
    from public.expenses
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_label is null or label = p_label) and
      (p_from is null or issued_at::date >= p_from) and
      (p_to is null or issued_at::date <= p_to)
    order by
      case when p_sort is null then issued_at end desc,
      case when p_sort = 'issued_at' then issued_at end,
      case when p_sort = 'title' then title end,
      case when p_sort = 'amount' then amount end,
      case when p_sort = 'currency' then currency end,
      case when p_sort = 'label' then label end,
      case when p_sort = '-issued_at' then issued_at end desc,
      case when p_sort = '-title' then title end desc,
      case when p_sort = '-amount' then amount end desc,
      case when p_sort = '-currency' then currency end desc,
      case when p_sort = '-label' then label end desc,
      issued_at desc,
      created_at desc,
      id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select count(*) as total_count
    from public.expenses
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_label is null or label = p_label) and
      (p_from is null or issued_at::date >= p_from) and
      (p_to is null or issued_at::date <= p_to)
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'title', c1.title,
        'amount', c1.amount,
        'currency', c1.currency,
        'label', c1.label,
        'issued_at', c1.issued_at,
        'doc_path', c1.doc_path
      )),
      'count', (select total_count from cte2)
    ) as result
  into result
  from cte1 c1;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_incomes_own_rows(p_page integer DEFAULT 1, p_sort text DEFAULT NULL::text, p_search text DEFAULT NULL::text, p_currency currency_type DEFAULT NULL::currency_type, p_from date DEFAULT NULL::date, p_to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  result jsonb;
begin
  with cte1 as (
    select
      id,
      title,
      amount,
      currency,
      issued_at::date,
      doc_path
    from public.incomes
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_from is null or issued_at::date >= p_from) and
      (p_to is null or issued_at::date <= p_to)
    order by
      case when p_sort is null then issued_at end desc,
      case when p_sort = 'issued_at' then issued_at end,
      case when p_sort = 'title' then title end,
      case when p_sort = 'amount' then amount end,
      case when p_sort = 'currency' then currency end,
      case when p_sort = '-issued_at' then issued_at end desc,
      case when p_sort = '-title' then title end desc,
      case when p_sort = '-amount' then amount end desc,
      case when p_sort = '-currency' then currency end desc,
      issued_at desc,
      created_at desc,
      id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select count(*) as total_count
    from public.incomes
    where
      (p_search is null or title ilike '%' || p_search || '%') and
      (p_currency is null or currency = p_currency) and
      (p_from is null or issued_at::date >= p_from) and
      (p_to is null or issued_at::date <= p_to)
  )
  select
    jsonb_build_object(
      'results', jsonb_agg(jsonb_build_object(
        'id', c1.id,
        'title', c1.title,
        'amount', c1.amount,
        'currency', c1.currency,
        'issued_at', c1.issued_at,
        'doc_path', c1.doc_path
      )),
      'count', (select total_count from cte2)
    ) as result
  into result
  from cte1 c1;

  return result;
end;
$function$
;