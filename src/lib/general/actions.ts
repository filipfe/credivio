"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const supabase = createClient();

export async function getOwnRows<T>(
  type: "income" | "expense" | "stock",
  searchParams?: SearchParams
): Promise<SupabaseResponse<T>> {
  try {
    const cols = type === "expense" ? "*, label(*)" : "*";
    let query = supabase.from(`${type}s`).select(cols, {
      count: "exact",
      head: false,
    });

    if (searchParams?.search) {
      const { search } = searchParams;
      let searchString = "";
      const ilike = `.ilike.%${search}%`;
      if (type === "stock") searchString = "symbol" + ilike;
      else searchString = "title" + ilike + ",description" + ilike;
      query = query.or(searchString);
    }

    if (searchParams?.sort) {
      const { sort } = searchParams;
      const ascending = !sort.includes("-");

      query = query.order(!ascending ? sort.split("-")[1] : sort, {
        ascending: ascending,
      });

      if (!sort.includes("issued_at")) {
        query = query.order("issued_at", { ascending: false });
      }

      if (sort.includes("-issued_at")) {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("created_at");
      }
    } else {
      query = query
        .order("issued_at", { ascending: false })
        .order("created_at", { ascending: false });
    }

    const page = Number(searchParams?.page);
    const { data, count, error } = await query.range(
      page ? page * 10 - 10 : 0,
      page ? page * 10 - 1 : 9
    );

    if (error) {
      console.log(error);
      return { results: [], error: error.message };
    }
    return {
      count,
      results: data as unknown as T[],
    };
  } catch (err) {
    return {
      results: [],
      error: "Error",
    };
  }
}

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
