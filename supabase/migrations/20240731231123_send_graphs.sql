drop function if exists "public"."inactive_get_active_goals"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.send_graphs()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  secret_key varchar;
begin
  select decrypted_secret into secret_key
  from vault.decrypted_secrets
  where name = 'notification';

  perform net.http_post(
    url := 'https://zjvcoczxcyffbcudeodc.supabase.co/functions/v1/notify-users',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdmNvY3p4Y3lmZmJjdWRlb2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNjYxNzEsImV4cCI6MjAzNDg0MjE3MX0.pHU8Ok2f5xyTAST8LZj8Ixkj24xz7Wbt3L89OHy-gsw',
      'x-secret-key', secret_key
    ),
    body := '{"options": {"graph": "weekly"}}'::jsonb
  );
end;
$function$
;