import { createClient } from "@/utils/supabase/client";

export async function getLatestOperations(
  platform: "telegram",
): Promise<SupabaseResponse<Payment>> {
  const supabase = createClient();

  const { data, error } = await supabase.from("operations").select("*").eq(
    `from_${platform}`,
    true,
  );

  if (error) {
    return {
      error: error.message,
      results: [],
    };
  }

  return {
    results: data,
  };
}
