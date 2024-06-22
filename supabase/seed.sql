insert into storage.buckets 
(id, name, public, file_size_limit, allowed_mime_types) values
('docs', 'docs', false, 5242880, '{image/jpeg, image/png, application/pdf}');

insert into languages 
(name, code) values
('Polski', 'pl-PL'),
('English', 'en-US');