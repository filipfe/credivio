import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

async function getStatsData(
  timezone: string,
  currency: string,
  month: number,
  year: number
): Promise<{ date: string; total_incomes: number; total_expenses: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_stats_data", {
    p_timezone: timezone,
    p_currency: currency,
    p_month: month,
    p_year: year,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export const useStatsData = (
  timezone: string,
  currency: string,
  month: number,
  year: number
) =>
  useSWR(
    ["stats", timezone, currency, month, year],
    ([_, timezone, currency, month, year]) =>
      getStatsData(timezone, currency, month, year)
  );

async function getBalanceHistory(
  timezone: string,
  currency: string,
  month: number,
  year: number
): Promise<{ date: string; total_expenses: number; total_incomes: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_stats_balance_history", {
    p_timezone: timezone,
    p_currency: currency,
    p_month: month,
    p_year: year,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export const useBalanceHistory = (
  timezone: string,
  currency: string,
  month: number,
  year: number
) =>
  useSWR(
    ["balance-history", timezone, currency, month, year],
    ([_, timezone, currency, month, year]) =>
      getBalanceHistory(timezone, currency, month, year)
  );

async function getExpensesByLabel(
  timezone: string,
  currency: string,
  month: number,
  year: number
): Promise<ChartLabel[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_stats_expenses_by_label", {
    p_timezone: timezone,
    p_currency: currency,
    p_month: month,
    p_year: year,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useExpensesByLabel = (
  timezone: string,
  currency: string,
  month: number,
  year: number
) =>
  useSWR(
    ["expenses_by_label", timezone, currency, month, year],
    ([_, timezone, currency, month, year]) =>
      getExpensesByLabel(timezone, currency, month, year)
  );

async function getOperationsByDayOfWeek(
  timezone: string,
  currency: string,
  month: number,
  year: number
): Promise<
  { day_of_week: number; total_incomes: number; total_expenses: number }[]
> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_stats_operations_by_day_of_week",
    {
      p_timezone: timezone,
      p_currency: currency,
      p_month: month,
      p_year: year,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useOperationsByDayOfWeek = (
  timezone: string,
  currency: string,
  month: number,
  year: number
) =>
  useSWR(
    ["operations-by-day-of-week", timezone, currency, month, year],
    ([_, timezone, currency, month, year]) =>
      getOperationsByDayOfWeek(timezone, currency, month, year)
  );
