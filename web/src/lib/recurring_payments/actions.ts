"use server";

import { createClient } from "@/utils/supabase/server";

export async function getRecurringPayments(): Promise<
  SupabaseResponse<RecurringPayment>
> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("recurring_payments")
    .select(
      "id, next_payment_date, interval_days, title, amount, currency, type"
    )
    .order("next_payment_date");

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
