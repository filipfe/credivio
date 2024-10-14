import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

async function getWeeklyGraph(
  timezone: string,
  currency: string
): Promise<DailyAmount[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_dashboard_weekly_graph", {
    p_timezone: timezone,
    p_currency: currency,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useWeeklyGraph = (timezone: string, currency: string) =>
  useSWR(["weekly_graph", timezone, currency], ([_key, tz, curr]) =>
    getWeeklyGraph(tz, curr)
  );
