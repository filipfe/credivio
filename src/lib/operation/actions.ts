"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

export async function getOperations(
  type: OperationType
): Promise<SupabaseResponse<Expense>> {
  try {
    const { data, error } = await supabase.from(`${type}s`).select("*");
    if (error) return { results: [], error: error.message };
    return { results: data };
  } catch (err) {
    return {
      results: [],
      error: "Error",
    };
  }
}

export async function addOperations(
  formData: FormData
): Promise<SupabaseResponse<Expense>> {
  const type = formData.get("type")?.toString() as OperationType;
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

    const { error } = await supabase.from(`${type}s`).insert(results);
    console.log(error);
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

  const path = type === "expense" ? "/expenses" : "/income";

  revalidatePath(path);
  revalidatePath("/");
  redirect(path);
}
