import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export const useExpensesByLabel = (
  currency: string,
  month?: number,
  year?: number
) =>
  useSWR(
    ["expenses_by_label", currency, month, year],
    ([_, currency, month, year]) => getChartLabels(currency, month, year)
  );

async function getChartLabels(
  currency: string,
  month?: number,
  year?: number
): Promise<ChartLabel[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_general_chart_labels", {
    p_currency: currency,
    p_month: month,
    p_year: year,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getLimits(currency: string): Promise<Limit[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_expenses_limits", {
    p_currency: currency,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useLimits = (currency?: string) =>
  useSWR(currency ? ["limits", currency] : null, ([_k, curr]) =>
    getLimits(curr)
  );
