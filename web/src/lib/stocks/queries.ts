"use client";

import { createClient } from "@/utils/supabase/client";
import formatError from "@/utils/supabase/format-error";
import useSWR from "swr";

async function getPriceHistory(
  short_symbol: string,
): Promise<PriceRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke(
    "get-stock-price-history",
    { body: { short_symbol } },
  );
  const err = await formatError(error);

  if (err || !data) {
    throw new Error(err || "Internal server error");
  }

  return data.results;
}

export const usePriceHistory = (short_symbol: string) =>
  useSWR(
    ["stocks", "price_history", short_symbol],
    ([_k, _t, short_symbol]) => getPriceHistory(short_symbol),
  );
