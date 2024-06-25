CREATE UNIQUE INDEX languages_code_key ON public.languages USING btree (code);

alter table "public"."languages" add constraint "languages_code_key" UNIQUE using index "languages_code_key";