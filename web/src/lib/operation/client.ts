import { createClient } from "@/utils/supabase/client";

export async function getChartLabels(
  currency: string,
): Promise<SupabaseResponse<ChartLabel>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc("get_chart_labels", {
    currency,
  });

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
