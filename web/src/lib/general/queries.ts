"use client";

import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

async function getLimits(timezone: string, currency: string): Promise<Limit[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_general_limits", {
    p_timezone: timezone,
    p_currency: currency,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useLimits = (timezone: string, currency: string) =>
  useSWR(["limits", timezone, currency], ([_k, tz, curr]) =>
    getLimits(tz, curr)
  );
