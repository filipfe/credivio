"use client";

import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

async function getGoals(currency: string): Promise<Goal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .select(
      "id, title, description, price, currency, deadline, is_priority, payments:goals_payments(amount)"
    )
    .eq("currency", currency)
    .order("deadline")
    .order("created_at")
    .returns<Goal[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGoals = (currency: string) =>
  useSWR(["goals", currency], ([_, curr]) => getGoals(curr));

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
  amount: string
): Promise<Omit<SupabaseResponse, "results">> {
  const supabase = createClient();

  const date = new Date().toDateString();

  const { data, error } = await supabase
    .from("goals_payments")
    .upsert({ date, goal_id, amount })
    .select();

  if (error) {
    return {
      error: error.message,
    };
  }
  return {};
}
