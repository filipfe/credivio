"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

export async function getExpenses(): Promise<SupabaseResponse<Expense>> {
  try {
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

export async function addExpenses(
  formData: FormData
): Promise<SupabaseResponse<Expense>> {
  const method = formData.get("method")?.toString() as AddMethodKey;
  const data = formData.get("data")!.toString();

  let results: Expense[] = [];

  try {
    switch (method) {
      case "csv":
        results = JSON.parse(data);
        break;
      case "manual":
        results = [JSON.parse(data)];
        break;
      default:
        return {
          error: "Nieprawidłowa metoda!",
          results,
        };
    }

    const { error } = await supabase.from("expenses").insert(results);
    if (error) {
      return {
        error: error.message,
        results: [],
      };
    }
  } catch (err) {
    return {
      error: "Parse error",
      results,
    };
  }

  revalidatePath("/expenses");
  redirect("/expenses");
}
