import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

async function getStatsData(
  currency: string,
  month?: number,
  year?: number
): Promise<{ date: string; total_incomes: number; total_expenses: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_stats_data", {
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

export const useStatsData = (currency: string, month?: number, year?: number) =>
  useSWR(["stats", currency, month, year], ([_, currency, month, year]) =>
    getStatsData(currency, month, year)
  );

async function getBalanceHistory(
  currency: string,
  month?: number,
  year?: number
): Promise<{ date: string; total_expenses: number; total_incomes: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_stats_balance_history", {
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
  currency: string,
  month?: number,
  year?: number
) =>
  useSWR(
    ["balance-history", currency, month, year],
    ([_, currency, month, year]) => getBalanceHistory(currency, month, year)
  );

async function getCumulativeExpensesByMonth(
  currency: string,
  month?: number,
  year?: number
): Promise<{ date: string; total_expenses: number; total_incomes: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_stats_cumulative_expenses_by_month",
    {
      p_currency: currency,
      p_month: month,
      p_year: year,
    }
  );

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export const useCumulativeExpensesByMonth = (
  currency: string,
  month?: number,
  year?: number
) =>
  useSWR(
    ["cumulative-expenses-by-month", currency, month, year],
    ([_, currency, month, year]) =>
      getCumulativeExpensesByMonth(currency, month, year)
  );

async function getExpensesByLabel(
  currency: string,
  month?: number,
  year?: number
): Promise<ChartLabel[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_stats_expenses_by_label", {
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
  currency: string,
  month?: number,
  year?: number
) =>
  useSWR(
    ["expenses_by_label", currency, month, year],
    ([_, currency, month, year]) => getExpensesByLabel(currency, month, year)
  );

async function getOperationsByDayOfWeek(
  currency: string,
  month?: number,
  year?: number
): Promise<
  { day_of_week: number; total_incomes: number; total_expenses: number }[]
> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_stats_operations_by_day_of_week",
    {
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
  currency: string,
  month?: number,
  year?: number
) =>
  useSWR(
    ["operations-by-day-of-week", currency, month, year],
    ([_, currency, month, year]) =>
      getOperationsByDayOfWeek(currency, month, year)
  );
