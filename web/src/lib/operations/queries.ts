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

export async function getDailyTotalAmounts(
  type: string,
  currency?: string,
): Promise<DailyAmount[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_general_daily_total_amount",
    { p_currency: currency, p_type: type },
  );

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function getBalances(
  params: { currency?: string; month?: number; year?: number },
): Promise<DailyAmount[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_dashboard_monthly_totals",
    { p_currency: params.currency, p_month: params.month, p_year: params.year },
  );

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
