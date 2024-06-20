import { createClient } from "supabase";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
      })
        .filter(([_k, value]) => !value).map(([key]) => key).join(", ")
    }`,
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default supabase;
