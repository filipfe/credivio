"use client";

import { createClient } from "@/utils/supabase/client";

export async function getGoals(): Promise<Goal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .select(
      "id, title, description, price, currency, deadline, is_priority, payments:goals_payments(amount)",
    )
    .order("deadline")
    .order("created_at");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getGoalsPayments(): Promise<GoalPayment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals_payments")
    .select("goal_id, amount, date");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function addGoalPayment(
  goal_id: string,
  amount: string,
): Promise<Omit<SupabaseResponse, "results">> {
  const supabase = createClient();

  const date = new Date().toDateString();

  console.log(date);

  const { data, error } = await supabase
    .from("goals_payments")
    .upsert(
      { date, goal_id, amount },
      { onConflict: ["date", "goal_id"] },
    ).select();

  console.log(data);
  if (error) {
    return {
      error: error.message,
    };
  }
  return {};
}
