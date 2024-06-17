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

  const { error } = await supabase.from("recurring_payments").delete().eq(
    "id",
    id,
  );

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/recurring-payments");

  return {};
}
