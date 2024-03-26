"use server";

import { createClient } from "@/utils/supabase/server";

export async function getGoals(): Promise<SupabaseResponse<Goal>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.from("goals").select("*");

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
