insert into "storage"."buckets" 
(id, name, public, file_size_limit, allowed_mime_types) values
('docs', 'docs', false, 10485760, '{image/jpeg, image/png, application/pdf}');

insert into "public"."services"
(name, href, price, title, description) values
('stocks', '/stocks', 14.99, 'Akcje', 'Usługa zarządzania akcjami umożliwia efektywne zarządzanie finansami, oferując narzędzia do monitorowania inwestycji, analizowania rynku i podejmowania świadomych decyzji inwestycyjnych. Dzięki niej użytkownicy mogą śledzić wartość swoich portfeli, otrzymywać powiadomienia o istotnych zmianach rynkowych oraz korzystać z raportów i analiz dostosowanych do ich indywidualnych potrzeb.')

  -- insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at)
  --   values ('00000000-0000-0000-0000-000000000000', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', 'authenticated', 'authenticated', 'rory@fischer.com', crypt ('balwan102', gen_salt ('bf')), '{"provider":"email","providers":["email"]}', '{"first_name": "Rory", "last_name": "Zappa", "currency": "PLN", "language_code": "pl-PL" }', timezone('utc'::text, now()), timezone('utc'::text, now()));

  -- insert into auth.identities (id, user_id, provider_id, identity_data, provider, created_at)
  --   values ('8d65ee5d-3897-4f61-b467-9bdc8df6f07f', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', '8d65ee5d-3897-4f61-b467-9bdc8df6f07f', '{"sub": "8d65ee5d-3897-4f61-b467-9bdc8df6f07f"}', 'email', timezone('utc'::text, now()));