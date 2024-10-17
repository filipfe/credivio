alter table "public"."goals" drop column "description";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_goals_current()
 RETURNS TABLE(id uuid, title text, price double precision, currency currency_type, deadline date, total_paid double precision, is_priority boolean)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query 
  select
    g.id,
    g.title,
    g.price,
    g.currency,
    g.deadline,
    coalesce(sum(gp.amount), 0) as total_paid,
    g.is_priority
  from goals g
  left join goals_payments gp on g.id = gp.goal_id
  group by g.id
  order by g.is_priority desc, g.deadline;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_goals_payments(p_timezone text, p_page integer)
 RETURNS TABLE(date date, payments jsonb)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query 
  with cte1 as (
    select generate_series(
      (current_timestamp at time zone p_timezone)::date - (21 * p_page) + 1, 
      (current_timestamp at time zone p_timezone)::date - (21 * (p_page - 1)), 
      interval '1 day'
    )::date as date
  ),
  cte2 as (
    select 
      c1.date,
      g.id as goal_id,
      g.currency,
      gp.amount
    from cte1 c1
    left join goals g on true
    left join goals_payments gp on gp.date = c1.date and gp.goal_id = g.id
    order by g.is_priority desc, g.deadline
  )   
  select
    c1.date,
    coalesce(
      jsonb_agg(jsonb_build_object(
        'goal_id', c2.goal_id,
        'currency', c2.currency, 
        'amount', coalesce(c2.amount, 0)
      )),
      '[]'::jsonb
    ) as payments
  from cte1 c1
  left join cte2 c2 on c2.date = c1.date
  group by c1.date
  order by c1.date;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_goals_priority_goal(p_limit integer DEFAULT 10)
 RETURNS record
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  result record;
begin
  with cte1 as (
    select
      g.id,
      g.title,
      g.price,
      g.currency,
      g.deadline,
      coalesce(sum(gp.amount), 0) as total_paid
    from goals g
    left join goals_payments gp on g.id = gp.goal_id
    where g.is_priority = true
    group by g.id
    limit 1
  )
  select
    c1.title,
    c1.price,
    c1.currency,
    c1.total_paid,
    coalesce(
      (
        select 
          jsonb_agg(jsonb_build_object(
            'date', gp.date,
            'amount', gp.amount
          ))
        from (
          select gp.date, gp.amount
          from goals_payments gp
          where gp.goal_id = c1.id
          order by gp.date desc
          limit p_limit
        ) gp
      ),
      '[]'::jsonb
    ) as payments
  into result
  from cte1 c1;

  if not found then
    return null;
  end if;

  return result;
end;
$function$
;


