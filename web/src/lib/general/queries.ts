import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

async function getLimits(currency: string): Promise<Limit[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_expenses_limits", {
    p_currency: currency,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useLimits = (currency?: string) =>
  useSWR(currency ? ["limits", currency] : null, ([_k, curr]) =>
    getLimits(curr)
  );
