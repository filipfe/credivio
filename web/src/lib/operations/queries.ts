"use client";

import { createClient } from "@/utils/supabase/client";

export async function getChartLabels(
  currency: string,
): Promise<SupabaseResponse<ChartLabel>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc(
    "get_dashboard_chart_labels",
    {
      p_currency: currency,
    },
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
  type: string,
): Promise<SupabaseResponse<DailyAmount>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc(
    "get_daily_total_amount",
    { p_currency: currency, p_type: type },
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

export async function getBudget(
  currency: string,
): Promise<SupabaseResponse<{ total_amount: number; currency: string }>> {
  // const supabase = createClient();
  return {
    results: [{ total_amount: 2, currency: "PLN" }],
  };
}
