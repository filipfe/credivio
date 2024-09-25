import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

async function getStats(currency: string) {
  // : Promise<{ date: string; total_amount: number }[]>
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_dashboard_stats", {
    p_currency: currency,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export const useStats = (currency: string) =>
  useSWR(["stats", currency], ([_, currency]) => getStats(currency));
