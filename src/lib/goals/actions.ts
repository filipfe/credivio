"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function getGoals(): Promise<SupabaseResponse<Goal>> {
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
