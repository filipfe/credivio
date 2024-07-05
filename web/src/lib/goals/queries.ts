"use client";

import { createClient } from "@/utils/supabase/client";

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

  const date = new Date().toISOString().substring(0, 10);

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
