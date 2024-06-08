drop policy "Enable select for users based on user_id" on "public"."recurring_payments";

create policy "Access based on user id"
on "public"."recurring_payments"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));