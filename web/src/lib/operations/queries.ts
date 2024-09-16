"use client";

import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export const useExpensesByLabel = (currency: string) =>
  useSWR(
    ["expenses_by_label", currency],
    ([_k, curr]) => getChartLabels(curr),
  );

async function getChartLabels(
  currency: string,
): Promise<ChartLabel[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    "get_dashboard_chart_labels",
    {
      p_currency: currency,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getDailyTotalAmounts(
  type: string,
  currency?: string,
): Promise<DailyAmount[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_general_daily_total_amount", {
    p_currency: currency,
    p_type: type,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

async function getOperationsAmountsHistory(
  type: "income" | "expense",
  params: SearchParams,
): Promise<DailyAmount[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_operations_daily_totals", {
    p_type: type,
    p_currency: params.currency,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export const useOperationsAmountsHistory = (
  type: "income" | "expense",
  params: SearchParams,
) =>
  useSWR(
    ["history", type, params],
    ([_, type, params]) => getOperationsAmountsHistory(type, params),
  );

async function getBalanceHistory(
  params: SearchParams,
): Promise<{ date: string; total_amount: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_dashboard_monthly_totals", {
    p_currency: params.currency,
    p_month: params.month,
    p_year: params.year,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export const useBalanceHistory = (params: SearchParams) =>
  useSWR(
    ["balance-history", params],
    ([_, params]) => getBalanceHistory(params),
  );

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

export const useLimits = (currency: string) =>
  useSWR(
    ["limits", currency],
    ([_k, curr]) => getLimits(curr),
  );

export async function addLimit(limit: NewLimit) {
  const { amount, currency, period } = limit;

  const supabase = createClient();

  const { error } = await supabase.from("limits").upsert({
    amount,
    currency,
    period,
  });

  if (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }

  return {};
}

async function getLabels(): Promise<Label[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_general_own_labels");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useLabels = () => useSWR("labels", () => getLabels());

export async function getLatestOperations(
  from?: string,
): Promise<Payment[]> {
  const supabase = createClient();
  let query = supabase
    .from("operations")
    .select("id, title, amount, currency, type, issued_at")
    .order("issued_at", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id")
    .limit(20);

  if (from) {
    query = query.eq(`from_${from}`, true);
  }

  const { data, error } = await query;

  console.log(data);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
