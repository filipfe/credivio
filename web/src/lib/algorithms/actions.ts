"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAlgorithms(): Promise<SupabaseResponse<_Algorithm>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("algorithms").select("*");

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results: data,
  };
}
