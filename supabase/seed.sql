insert into "storage"."buckets" 
(id, name, public, file_size_limit, allowed_mime_types) values
('docs', 'docs', false, 10485760, '{image/jpeg, image/png, application/pdf}');

insert into "public"."services"
(name, href, price, title, description) values
('stocks', '/stocks', 14.99, 'Akcje', 'Usługa zarządzania akcjami umożliwia efektywne zarządzanie finansami, oferując narzędzia do monitorowania inwestycji, analizowania rynku i podejmowania świadomych decyzji inwestycyjnych. Dzięki niej użytkownicy mogą śledzić wartość swoich portfeli, otrzymywać powiadomienia o istotnych zmianach rynkowych oraz korzystać z raportów i analiz dostosowanych do ich indywidualnych potrzeb.')

-- select actions_dev_data_seeding();