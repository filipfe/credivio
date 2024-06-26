"use client";

import { createClient } from "@/utils/supabase/client";

export async function getChartLabels(
  currency: string
): Promise<SupabaseResponse<ChartLabel>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc(
    "get_dashboard_chart_labels",
    {
      currency,
    }
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

export async function getDailyTotalAmount(
  currency: string,
  type: string
): Promise<SupabaseResponse<DailyAmount>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc(
    "get_daily_total_amount",
    { currency, type }
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
