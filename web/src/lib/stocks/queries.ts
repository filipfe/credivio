"use client";

import { createClient } from "@/utils/supabase/client";
import formatError from "@/utils/supabase/format-error";

export async function getPriceHistory(
  short_symbol: string,
): Promise<SupabaseResponse<PriceRecord>> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke(
    "get-stock-price-history",
    { body: { short_symbol } },
  );
  const err = await formatError(error);

  if (err || !data) {
    return {
      error: err || "Internal server error",
      results: [],
    };
  }

  return {
    results: data.results,
  };
}
