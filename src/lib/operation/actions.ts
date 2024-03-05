"use server";

import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

export async function getOperations(
  type: OperationType,
  searchParams?: OperationSearchParams
): Promise<SupabaseResponse<Expense>> {
  try {
    if (searchParams?.sort) {
      const { sort } = searchParams;
      const page = Number(searchParams.page);
      const { data, error } = await supabase
        .from(`${type}s`)
        .select("*")
        .order(sort.includes("-") ? sort.split("-")[1] : sort, {
          ascending: sort.includes("-") ? false : true,
        })
        .range(page ? page * 10 - 10 : 0, page ? page * 10 - 1 : 9);

      const { count } = await supabase
        .from(`${type}s`)
        .select("*", { count: "exact", head: true });

      if (error) {
        return { results: [], error: error.message };
      }
      return { count, results: data };
    } else {
      const page = Number(searchParams?.page);
      const { data, error } = await supabase
        .from(`${type}s`)
        .select("*")
        .order("issued_at", { ascending: false })
        .range(page ? page * 10 - 10 : 0, page ? page * 10 - 1 : 9);

      const { count } = await supabase
        .from(`${type}s`)
        .select("*", { count: "exact", head: true });

      if (error) {
        return { results: [], error: error.message };
      }
      return { count, results: data };
    }
  } catch (err) {
    return {
      results: [],
      error: "Error",
    };
  }
}

export async function addOperations(
  formData: FormData
): Promise<SupabaseResponse<Operation>> {
  const type = formData.get("type")?.toString() as OperationType;
  const data = formData.get("data")!.toString();

  try {
    const results: Operation[] = JSON.parse(data);
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
      results: [],
    };
  }

  const path = type === "expense" ? "/expenses" : "/incomes";

  revalidatePath(path);
  revalidatePath("/");
  redirect(path);
}

export async function getCurrencies(): Promise<SupabaseResponse<Currency>> {
  try {
    const { data: results } = await axios.get(
      "https://bossa.pl/fl_api/API/FX/v1/Q/Currencies"
    );
    return {
      results,
    };
  } catch (err) {
    return {
      results: [],
      error: "Wystąpił błąd, spróbuj ponownie później!",
    };
  }
}
