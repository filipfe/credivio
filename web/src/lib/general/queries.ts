import { createClient } from "@/utils/supabase/client";
import { getLocalTimeZone, today } from "@internationalized/date";
import { endOfWeek, startOfWeek } from "date-fns";
import useSWR from "swr";

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
  useSWR(
    currency ? ["limits", currency] : null,
    ([_k, curr]) => getLimits(curr),
  );

async function getWeeklyGraph(
  currency: string,
  from: string,
  to: string,
): Promise<Payment[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("expenses").select(
    "amount, currency, label, issued_at",
  )
    .eq("currency", currency)
    .lte("issued_at", to)
    .gte("issued_at", from)
    .returns<Payment[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useWeeklyGraph = (currency: string, from: string, to: string) =>
  useSWR(
    ["weekly_graph", currency, from, to],
    ([_key, curr, from, to]) => getWeeklyGraph(curr, from, to),
  );
