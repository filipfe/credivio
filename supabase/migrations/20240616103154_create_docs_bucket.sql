create policy "Give users access to own folder 1u7gb_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'docs'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1u7gb_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'docs'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1u7gb_2"
on "storage"."objects"
as permissive
for update
using (((bucket_id = 'docs'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1u7gb_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'docs'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));