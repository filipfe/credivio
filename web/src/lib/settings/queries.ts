import { createClient } from "@/utils/supabase/client";

export async function getLanguages(): Promise<SupabaseResponse<Language>> {
  const supabase = createClient();

  const { data: results, error } = await supabase.from("languages").select(
    "code, name",
  );

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
