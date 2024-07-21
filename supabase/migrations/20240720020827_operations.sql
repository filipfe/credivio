drop function if exists "public"."get_expenses_own_rows"(p_page integer, p_sort text, p_label text, p_search text, p_currency currency_type);

drop function if exists "public"."get_incomes_own_rows"(p_page integer, p_sort text, p_search text, p_currency currency_type);

drop function if exists "public"."get_operations_daily_totals"(p_type operation_type, p_currency currency_type);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_expenses_own_rows(p_page integer DEFAULT 1, p_sort text DEFAULT NULL::text, p_label text DEFAULT NULL::text, p_search text DEFAULT NULL::text, p_currency currency_type DEFAULT NULL::currency_type, p_from date DEFAULT NULL::date, p_to date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
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
    from expenses
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
      id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select count(*) as total_count
    from expenses
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
    from incomes
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
      id
    limit 10 offset (p_page - 1) * 10
  ),
  cte2 as (
    select count(*) as total_count
    from incomes
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

CREATE OR REPLACE FUNCTION public.get_dashboard_monthly_totals(p_currency currency_type DEFAULT NULL::currency_type, p_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE), p_month integer DEFAULT EXTRACT(month FROM CURRENT_DATE))
 RETURNS TABLE(date date, total_amounts jsonb)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      date_trunc('month', make_date($2, $3, 1)),
      (date_trunc('month', make_date($2, $3, 1)) + interval '1 month - 1 day')::date,
      interval '1 day'
    )::date as date
  ),
  cte2 as (
    select
      c1.date,
      o.currency,
      coalesce((
        sum(
          case
            when o.type = 'income' then amount
            else -amount
          end
        )
      ), 0) as total_amount
    from cte1 c1
    left join operations o on
      c1.date = o.issued_at::date
      and ($1 is null or o.currency = $1)
    group by c1.date, o.currency
  )
  select
    c2.date,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'currency', currency,
          'amount', total_amount
        )
      ) filter (where currency is not null),
      '[]'::jsonb
    ) as total_amounts
  from cte2 c2
  group by c2.date
  order by c2.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_daily_totals(p_type operation_type, p_currency currency_type DEFAULT NULL::currency_type)
 RETURNS TABLE(date date, total_amounts jsonb)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  with cte1 as (
    select generate_series(
      (current_date - interval '30 days')::date,
      current_date,
      interval '1 day'
    )::date as date
  ),
  cte2 as (
    select
      c1.date as date,
      o.currency,
      coalesce(sum(amount), 0) as total_amount
    from cte1 c1
    left join operations o on
      c1.date = o.issued_at::date
      and o.type = $1
      and ($2 is null or o.currency = $2)
    group by c1.date, o.currency
  )
  select
    c2.date,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'currency', currency,
          'amount', total_amount
        )
      ) filter (where currency is not null),
      '[]'::jsonb
    ) as total_amounts
  from cte2 c2
  group by c2.date
  order by c2.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_operations_stats(p_currency currency_type, p_type operation_type)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
declare
  result record;
begin
  with cte1 as (
    select
      sum(
        case
          when date_trunc('month', o.issued_at) = date_trunc('month', current_date) then o.amount
          else 0
        end
      ) as current_month_total,
      sum(
        case
          when date_trunc('month', o.issued_at) = date_trunc('month', current_date - interval '1 month') then o.amount
          else 0
        end
      ) as last_month_total,
      sum(
        case
          when o.issued_at::date = current_date then o.amount
          else 0
        end
      ) as current_day_total,
      sum(
        case
          when o.issued_at::date = current_date - 1 then o.amount
          else 0
        end
      ) as last_day_total
    from operations o
    where
      o.currency = $1
      and o.type = $2
      and date_trunc('month', o.issued_at) >= date_trunc('month', current_date - interval '1 month')
  )
  select
    json_build_object(
      'amount', c1.current_month_total,
      'difference', (
        case
          when c1.last_month_total = 0 then
            case
              when c1.current_month_total = 0 then 0
              else 100
            end
          else round((abs(c1.current_month_total - c1.last_month_total) / c1.last_month_total * 100)::numeric, 2)
        end
      ),
      'difference_indicator',
        case
          when c1.current_month_total > c1.last_month_total then 'positive'
          when c1.current_month_total < c1.last_month_total then 'negative'
          else 'no_change'
        end
    ) as last_month,
    json_build_object(
      'amount', c1.current_day_total,
      'difference', (
        case
          when c1.last_day_total = 0 then
            case
              when c1.current_day_total = 0 then 0
              else 100
            end
          else round((abs(c1.current_day_total - c1.last_day_total) / c1.last_day_total * 100)::numeric, 2)
        end
      ),
      'difference_indicator', case
        when c1.current_day_total > c1.last_day_total then 'positive'
        when c1.current_day_total < c1.last_day_total then 'negative'
        else 'no_change'
      end
    ) as last_day
  into result
  from cte1 c1;
  return result;
end;
$function$
;