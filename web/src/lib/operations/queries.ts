import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export async function getDailyTotalAmounts(
  type: string,
  currency?: string
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
  timezone: string,
  params: SearchParams
): Promise<DailyAmount[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_operations_daily_totals", {
    p_type: type,
    p_timezone: timezone,
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
  timezone: string,
  params: SearchParams
) =>
  useSWR(["history", type, timezone, params], ([_, type, timezone, params]) =>
    getOperationsAmountsHistory(type, timezone, params)
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

export async function getLatestOperations(from?: string): Promise<Payment[]> {
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

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
