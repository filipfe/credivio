"use server";

import { createClient } from "@/utils/supabase/server";

export async function getExpenses(): Promise<SupabaseResponse<Expense>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("expenses").select("*");
    if (error) return { results: [], error: error.message };
    return { results: data };
  } catch (err) {
    return {
      results: [],
      error: "Error",
    };
  }
}

export async function addExpenses(formData: FormData) {
  console.log("feafeafeaf");
  const file = formData.get("csv-file")?.toString();
  console.log(file);
  if (!file) return;
  try {
  } catch (err) {}
}
