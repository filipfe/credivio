drop policy "Enable delete for users based on user_id" on "public"."expenses";

drop policy "Enable insert for users based on user_id" on "public"."expenses";

drop policy "Enable read access for users based on user_id" on "public"."expenses";

drop policy "Enable CRUD for users based on their user id" on "public"."goals";

drop policy "Enable delete for users based on user_id" on "public"."incomes";

drop policy "Enable insert for users based on user_id" on "public"."incomes";

drop policy "Enable read access for users based on user_id" on "public"."incomes";

drop policy "Enable select for users based on user id" on "public"."profiles";

drop policy "Enable update for owners" on "public"."profiles";

drop policy "Enable delete for users based on user_id" on "public"."stocks";

drop policy "Enable insert for users based on user_id" on "public"."stocks";

drop policy "Enable select for users based on their user id" on "public"."stocks";

drop policy "Access based on user id" on "public"."user_services";

create policy "Access based on user id"
on "public"."expenses"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Access based on user id"
on "public"."goals"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Access based on user id"
on "public"."incomes"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Access based on user id"
on "public"."profiles"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Access based on user id"
on "public"."stocks"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Access based on user id"
on "public"."user_services"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));