"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getGoals(): Promise<SupabaseResponse<Goal>> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("goals")
    .select(
      "id, title, description, price, currency, deadline, is_priority, payments:goals_payments(amount, date)",
    )
    .order("deadline")
    .order("created_at");

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

export async function addGoalPayment(formData: FormData): Promise<
  Pick<SupabaseResponse, "error"> | undefined
> {
  const amount = formData.get("amount")?.toString();
  const goal_id = formData.get("goal_id")?.toString();
  const date = new Date().toDateString();
  const supabase = createClient();

  const { error } = await supabase
    .from("goals_payments")
    .upsert(
      { date, goal_id, amount },
      { onConflict: ["date", "goal_id"] },
    );

  if (error) {
    console.error("Couldn't add goal payment: ", error);
    return {
      error: error.message,
    };
  }

  revalidatePath("/goals");
}
