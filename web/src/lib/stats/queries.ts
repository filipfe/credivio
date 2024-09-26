import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

async function getStats(
  currency: string,
  month?: number,
  year?: number
): Promise<{ incomes: number; expenses: number; balance: number }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_general_stats", {
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

export const useStats = (currency: string, month?: number, year?: number) =>
  useSWR(["stats", currency, month, year], ([_, currency, month, year]) =>
    getStats(currency, month, year)
  );

async function getBalanceHistory(
  currency: string,
  month?: number,
  year?: number
): Promise<{ date: string; total_amount: number }[]> {
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
