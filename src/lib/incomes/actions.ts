"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

export async function getIncomes(
  sort?: string,
  page?: number
): Promise<SupabaseResponse<Income>> {
  try {
    if (sort) {
      const { data, error } = await supabase
        .from("incomes")
        .select("*")
        .order(sort.includes("-") ? sort.split("-")[1] : sort, {
          ascending: sort.includes("-") ? false : true,
        })
        .range(page ? page * 10 - 10 : 0, page ? page * 10 - 1 : 9);

      const { count } = await supabase
        .from("incomes")
        .select("*", { count: "exact", head: true });

      if (error) {
        return { results: [], error: error.message };
      }
      return { count: count, results: data };
    } else {
      const { data, error } = await supabase
        .from("incomes")
        .select("*")
        .order("issued_at", { ascending: false })
        .range(page ? page * 10 - 10 : 0, page ? page * 10 - 1 : 9);

      const { count } = await supabase
        .from("incomes")
        .select("*", { count: "exact", head: true });

      if (error) {
        return { results: [], error: error.message };
      }
      return { count: count, results: data };
    }
  } catch (err) {
    return {
      results: [],
      error: "Error",
    };
  }
}

export async function addIncomes(
  formData: FormData
): Promise<SupabaseResponse<Income>> {
  const method = formData.get("method")?.toString() as AddMethodKey;
  const data = formData.get("data")!.toString();

  let results: Income[] = [];

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

    const { error } = await supabase.from("incomes").insert(results);
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

  revalidatePath("/incomes");
  redirect("/incomes");
}
