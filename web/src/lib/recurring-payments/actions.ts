"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getRecurringPayments(): Promise<
  SupabaseResponse<RecurringPayment>
> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc(
    "get_recurring_payments_active_payments",
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

export async function deleteRecurringPayment(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    return {
      error: "No such a payment found, try again!",
    };
  }
  const supabase = createClient();

  const { error } = await supabase
    .from("recurring_payments")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/recurring-payments");

  return {};
}

export async function addRecurringPayment(formData: FormData) {
  const title = formData.get("title")?.toString();
  const amount = formData.get("amount")?.toString();
  const currency = formData.get("currency")?.toString();
  const start_date = formData.get("start_date")?.toString();
  const interval_unit = formData.get("interval_unit")?.toString();
  const interval_amount = formData.get("interval_amount")?.toString();

  const supabase = createClient();

  const { error } = await supabase.from("recurring_payments").insert({
    title,
    amount,
    start_date,
    interval_amount,
    interval_unit,
    currency,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {};
}
