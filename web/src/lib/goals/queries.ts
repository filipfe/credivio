"use client";

import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

async function getGoals(currency: string): Promise<Goal[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_goals_current", {
    p_currency: currency,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGoals = (currency: string) =>
  useSWR(["goals", currency], ([_k, curr]) => getGoals(curr));
