-- BUCKETS
insert into storage.buckets (
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types
) values (
  'docs', 
  'docs', 
  false, 
  10485760, 
  '{image/jpeg, image/png, application/pdf}'
);

-- LANGUAGES
insert into languages (name, code) values
  ('Polski', 'pl'),
  ('English', 'en'),
  ('Español', 'es');

-- SERVICES
insert into services (
  name, 
  href, 
  price, 
  title, 
  description
) values (
  'stocks', 
  '/stocks', 
  14.99, 
  'Akcje', 
  'Usługa zarządzania akcjami umożliwia efektywne zarządzanie finansami, oferując narzędzia do monitorowania inwestycji, analizowania rynku i podejmowania świadomych decyzji inwestycyjnych. Dzięki niej użytkownicy mogą śledzić wartość swoich portfeli, otrzymywać powiadomienia o istotnych zmianach rynkowych oraz korzystać z raportów i analiz dostosowanych do ich indywidualnych potrzeb.'
);

-- USER
insert into auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new, 
  email_change,
  raw_app_meta_data, 
  raw_user_meta_data,
  created_at, 
  updated_at,
  phone_change, 
  phone_change_token,
  email_change_token_current, 
  email_change_confirm_status,
  reauthentication_token
) values (
  '00000000-0000-0000-0000-000000000000', 
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  'authenticated', 
  'authenticated', 
  'test@monfuse.com',  
  extensions.crypt('maciek102', extensions.gen_salt('bf')), 
  timezone('utc'::text, now()),
  '', 
  '',
  '', 
  '',
  '{"provider": "email", "providers": ["email"]}', 
  '{
    "first_name": "Rory", 
    "last_name": "Zappa", 
    "currency": "PLN", 
    "language": "pl",
    "timezone": "Europe/Warsaw"
  }',
  timezone('utc'::text, now()), 
  timezone('utc'::text, now()),
  '', 
  '',
  '', 
  0, 
  ''
);

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 
  '{
    "sub": "8d65ee5d-3897-4f61-b467-9bdc8df6f07f", 
    "first_name": "Rory", 
    "last_name": "Zappa", 
    "currency": "PLN", 
    "timezone": "Europe/Warsaw"
  }', 
  'email', 
  timezone('utc'::text, now()), 
  timezone('utc'::text, now()), 
  timezone('utc'::text, now())
);

-- EXPENSES
with cte1 as (
  select
    case
      when random() < 0.3 then 'Jedzenie'
      when random() < 0.6 then 'Rachunki'
      when random() < 0.75 then 'Transport'
      when random() < 0.85 then 'Rozrywka'
      when random() < 0.9 then 'Ubrania'
      else (array[
        'Prezenty', 'Urlop', 'Zdrowie', 'Mieszkanie', 'Sport', 'Kultura', 'Elektronika'
      ])[floor(random() * 7 + 1)]
    end as label
  from generate_series(1, 500)
)
insert into expenses (title, amount, currency, user_id, label, recurring, from_telegram, issued_at)
select
  case
    when c1.label = 'Jedzenie' then (array['Zakupy spożywcze', 'Obiad w restauracji', 'Lunch w kawiarni', 'Jedzenie na wynos'])[floor(random() * 4 + 1)]
    when c1.label = 'Rachunki' then (array['Rachunek za prąd', 'Rachunek za wodę', 'Rachunek za gaz', 'Rachunek za telefon', 'Rachunek za internet'])[floor(random() * 5 + 1)]
    when c1.label = 'Transport' then (array['Bilety na pociąg', 'Bilety autobusowe', 'Paliwo', 'Serwis samochodowy', 'Przejazd taksówką'])[floor(random() * 5 + 1)]
    when c1.label = 'Rozrywka' then (array['Bilety do kina', 'Bilety na koncert', 'Abonament streamingowy', 'Wycieczka do parku rozrywki'])[floor(random() * 4 + 1)]
    when c1.label = 'Ubrania' then (array['Zakup ubrań', 'Zakup butów', 'Zakup kurtki zimowej', 'Zakup koszulki i spodni'])[floor(random() * 4 + 1)]
    when c1.label = 'Prezenty' then (array['Prezent urodzinowy', 'Prezent świąteczny', 'Prezent dla przyjaciela'])[floor(random() * 3 + 1)]
    when c1.label = 'Urlop' then (array['Wakacje w górach', 'Wakacje na plaży', 'Weekendowy wypad'])[floor(random() * 3 + 1)]
    when c1.label = 'Zdrowie' then (array['Wizyta u lekarza', 'Zakup leków w aptece', 'Ubezpieczenie zdrowotne'])[floor(random() * 3 + 1)]
    when c1.label = 'Mieszkanie' then 'Czynsz za mieszkanie'
    when c1.label = 'Sport' then (array['Karnet na siłownię', 'Zakup sprzętu sportowego', 'Zajęcia fitness'])[floor(random() * 3 + 1)]
    when c1.label = 'Kultura' then (array['Bilety do teatru', 'Zwiedzanie muzeum', 'Wydarzenie kulturalne'])[floor(random() * 3 + 1)]
    when c1.label = 'Elektronika' then (array['Zakup laptopa', 'Zakup smartfona', 'Zakup słuchawek'])[floor(random() * 3 + 1)]
    else 'Inny wydatek'
  end,
  case
    when c1.label = 'Jedzenie' then round((random() * 200 + 20)::numeric, 2)
    when c1.label = 'Rachunki' then round((random() * 400 + 100)::numeric, 2)
    when c1.label = 'Transport' then round((random() * 150 + 10)::numeric, 2)
    when c1.label = 'Rozrywka' then round((random() * 300 + 30)::numeric, 2)
    when c1.label = 'Ubrania' then round((random() * 500 + 50)::numeric, 2)
    when c1.label = 'Prezenty' then round((random() * 300 + 50)::numeric, 2)
    when c1.label = 'Urlop' then round((random() * 3000 + 500)::numeric, 2)
    when c1.label = 'Zdrowie' then round((random() * 500 + 50)::numeric, 2)
    when c1.label = 'Mieszkanie' then round((random() * 2000 + 800)::numeric, 2)
    when c1.label = 'Sport' then round((random() * 400 + 50)::numeric, 2)
    when c1.label = 'Kultura' then round((random() * 200 + 30)::numeric, 2)
    when c1.label = 'Elektronika' then round((random() * 5000 + 500)::numeric, 2)
    else round((random() * 1000 + 100)::numeric, 2)
  end,
  ( 
    case
      when random() < 0.8 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end
  )::currency_type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  c1.label,
  case
    when random() < 0.05 then true
    else false
  end as recurring,
  random() < 0.3 as from_telegram,
  case
    when random() < 0.2 then now() - (random() * interval '90 day')
    else now() - (random() * interval '1 year')
  end as issued_at
from cte1 c1;

-- INCOMES
insert into incomes (title, amount, currency, user_id, recurring, from_telegram, issued_at)
select
  case
    when random() < 0.5 then 'Wypłata'
    when random() < 0.7 then (array['Projekt freelance', 'Konsultacje', 'Dodatkowa praca'])[floor(random() * 3 + 1)]
    when random() < 0.8 then (array['Premia od pracodawcy', 'Premia roczna', 'Premia za wyniki'])[floor(random() * 3 + 1)]
    when random() < 0.85 then (array['Zwrot z inwestycji', 'Dywidenda', 'Zysk z handlu kryptowalutami'])[floor(random() * 3 + 1)]
    when random() < 0.9 then (array['Prezent od rodziny', 'Spadek'])[floor(random() * 2 + 1)]
    when random() < 0.95 then 'Dochód z wynajmu'
    else 'Zwrot podatku'
  end,
  round((random() * (case when random() < 0.7 then 5000 else 10000 end))::numeric, 2),
  ( 
    case
      when random() < 0.9 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end
  )::currency_type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  case
    when random() < 0.2 then true
    else false
  end as recurring,
  random() < 0.2 as from_telegram,
  case
    when random() < 0.3 then now() - (random() * interval '90 day')
    else now() - (random() * interval '1 year')
  end as issued_at
from generate_series(1, 500);

-- RECURRING PAYMENTS
with cte1 as (
  select 
    (array['income', 'expense'])[floor(random() * 2 + 1)]::operation_type as type
  from generate_series(1, 10)
), cte2 as (
  select
    c1.type,
    case
      when c1.type = 'expense' then 
        case
          when random() < 0.6 then 'month'
          when random() < 0.8 then 'year'
          when random() < 0.9 then 'week'
          else 'day'
        end
      else 
        case
          when random() < 0.7 then 'month'
          when random() < 0.9 then 'week'
          else 'year'
        end
    end::interval_unit_type as interval_unit
  from cte1 c1
)
insert into recurring_payments (title, amount, currency, type, user_id, interval_amount, interval_unit, start_date)
select
  case
    when c2.type = 'expense' then 
      (array['Czynsz za mieszkanie', 'Rachunek za prąd', 'Rachunek za internet', 'Abonament za telefon', 'Subskrypcja streamingowa', 'Polisa ubezpieczeniowa'])[floor(random() * 6 + 1)]
    else 
      (array['Wypłata', 'Premia', 'Dochód z wynajmu', 'Zwrot z inwestycji'])[floor(random() * 4 + 1)]
  end,
  case
    when c2.type = 'expense' then round((random() * 500 + 50)::numeric, 2)
    else round((random() * 10000 + 2000)::numeric, 2)
  end,
  case
    when random() < 0.8 then 'PLN'
    else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
  end::currency_type,
  c2.type,
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  case
    when c2.interval_unit = 'day' then floor(random() * 5 + 1)
    when c2.interval_unit = 'week' then floor(random() * 3 + 1)
    when c2.interval_unit = 'month' then 1
    when c2.interval_unit = 'year' then 1
  end,
  c2.interval_unit,
  (now() - (random() * interval '3 day'))::date
from cte2 c2;

-- GOALS
with cte1 as (
  select 
    case
      when random() < 0.2 then 'Wakacje'
      when random() < 0.4 then 'Zakup samochodu'
      when random() < 0.6 then 'Remont mieszkania'
      when random() < 0.75 then 'Sprzęt elektroniczny'
      when random() < 0.85 then 'Nowy telefon'
      else 'Inwestycja'
    end as title
  from generate_series(1, 7)
), cte2 as (
  insert into goals (title, price, currency, user_id, deadline, is_priority)
  select
    c1.title,
    case
      when c1.title = 'Wakacje' then round((random() * 8000 + 2000)::numeric, 2)
      when c1.title = 'Zakup samochodu' then round((random() * 50000 + 20000)::numeric, 2)
      when c1.title = 'Remont mieszkania' then round((random() * 30000 + 10000)::numeric, 2)
      when c1.title = 'Sprzęt elektroniczny' then round((random() * 5000 + 1000)::numeric, 2)
      when c1.title = 'Nowy telefon' then round((random() * 3000 + 1000)::numeric, 2)
      else round((random() * 100000 + 50000)::numeric, 2)
    end,
    case
      when random() < 0.8 then 'PLN'
      else (array['USD', 'EUR', 'GBP', 'CHF'])[floor(random() * 4 + 1)]
    end::currency_type,
    '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
    case
      when random() < 0.15 then null
      else (now() + (random() * interval '3 year'))::date
    end,
    true
  from cte1 c1 
  returning id, price
) 
insert into goals_payments (goal_id, amount, date)
select 
  c2.id, 
  round((random() * (c2.price / 10))::numeric, 2), 
  gs.date
from cte2 c2
cross join (
  select 
    now()::date - s.i as date
  from generate_series(0, 29) s(i)
  order by random()
  limit 10
) as gs;

-- LIMITS
insert into limits (user_id, period, currency, amount)
select
  '8d65ee5d-3897-4f61-b467-9bdc8df6f07f',
  period,
  'PLN',
  case
    when period = 'daily' then round((random() * 50 + 10)::numeric, 2)
    when period = 'weekly' then round((random() * 300 + 50)::numeric, 2)
    when period = 'monthly' then round((random() * 2000 + 500)::numeric, 2)
  end
from (
  select 'daily'::period_type as period
  union all
  select 'weekly'
  union all
  select 'monthly'
) as periods;