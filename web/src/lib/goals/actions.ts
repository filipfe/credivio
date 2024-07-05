"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getGoals(): Promise<SupabaseResponse<Goal>> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("goals")
    .select(
      "id, title, description, price, saved, currency, deadline, is_priority",
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

export async function getGoalsPayments(): Promise<
  SupabaseResponse<GoalPayment>
> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("goals_payments")
    .select("goal_id, amount, date");

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
  const date = formData.get("date")?.toString();
  const supabase = createClient();

  const { error } = await supabase.from("goals_payments").upsert({
    amount,
    goal_id,
    date,
  }).match({ date, goal_id });

  if (error) {
    console.error("Couldn't add goal payment: ", error);
    return {
      error: error.message,
    };
  }

  revalidatePath("/goals");
}
