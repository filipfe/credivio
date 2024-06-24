import { assertGreater } from "https://deno.land/std@0.224.0/assert/assert_greater.ts";
import { createClient } from "supabase";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

async function testResults() {
  if (!SUPABASE_ANON_KEY || !SUPABASE_URL) {
    throw new Error(
      `Environment variables missing: ${
        SUPABASE_URL ? "SUPABASE_ANON_KEY" : "SUPABASE_URL"
      }`,
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const res = await fetch(
    "https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_shares",
  );

  const stocks = await res.json();

  const { data } = await supabase.functions.invoke("get-stock-price-history", {
    body: {
      short_symbol: stocks._d[0]._t[0],
    },
  });

  assertGreater(data.results.length, 0);
}

Deno.test("Function results test", testResults);
