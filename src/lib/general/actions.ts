"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const supabase = createClient();

export async function getSpecificRow<T>(
  id: string,
  type: "income" | "expense" | "stock"
): Promise<SupabaseResponse<T>> {
  const { data, error } = await supabase
    .from(`${type}s`)
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }
  return {
    results: [data],
  };
}

export async function deleteRows<T>(
  formData: FormData
): Promise<SupabaseResponse<T>> {
  const type = formData.get("type")!.toString();
  const data = formData.get("data")!.toString();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (!user || authError) {
      return {
        results: [],
        error: "Błąd autoryzacji, spróbuj zalogować się ponownie!",
      };
    }
    let query = supabase.from(`${type}s`).delete();
    if (data === "all") {
      query = query.eq("user_id", user.id);
    } else {
      const ids: string[] = JSON.parse(data);
      query = query.in("id", ids);
    }
    const { error } = await query;
    if (error) {
      return {
        results: [],
        error: error.message,
      };
    }
    revalidatePath(`${type}s`);
    return {
      results: [],
    };
  } catch (err) {
    console.log(err);
    return {
      error: "Wystąpił błąd, spróbuj ponownie później!",
      results: [],
    };
  }
}
