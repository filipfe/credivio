"use server";

import { createClient } from "@/utils/supabase/server";

export async function getGoals(): Promise<SupabaseResponse<Goal>> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("goals")
    .select(
      "id, title, description, price, saved, currency, deadline, is_priority"
    )
    .order("deadline")
    .order("created_at");

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}

export async function getActiveGoals(): Promise<SupabaseResponse<ActiveGoal>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc("get_active_goals");

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}
