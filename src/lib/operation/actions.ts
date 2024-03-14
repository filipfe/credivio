"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

export async function getOperations(
  type: OperationType,
  searchParams?: OperationSearchParams
): Promise<SupabaseResponse<Operation>> {
  try {
    if (searchParams?.sort) {
      const { sort } = searchParams;
      const page = Number(searchParams.page);
      let query = supabase
        .from(`${type}s`)
        .select("*", { count: "exact", head: false })
        .order(sort.includes("-") ? sort.split("-")[1] : sort, {
          ascending: sort.includes("-") ? false : true,
        });

      if (!sort.includes("issued_at")) {
        query = query.order("issued_at", { ascending: false });
      }

      if (sort.includes("-issued_at")) {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("created_at");
      }

      const { data, count, error } = await query.range(
        page ? page * 10 - 10 : 0,
        page ? page * 10 - 1 : 9
      );

      if (error) {
        return { results: [], error: error.message };
      }
      return { count, results: data };
    } else {
      const page = Number(searchParams?.page);
      const { data, count, error } = await supabase
        .from(`${type}s`)
        .select("*", { count: "exact", head: false })
        .order("issued_at", { ascending: false })
        .order("created_at", { ascending: false })
        .range(page ? page * 10 - 10 : 0, page ? page * 10 - 1 : 9);

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
  const label = formData.get("label")?.toString();
  const data = formData.get("data")!.toString();

  try {
    let results: Operation[] = JSON.parse(data);
    if (label) {
      const { data: existingLabel } = await supabase
        .from("labels")
        .select("id")
        .eq("title", label)
        .single();
      if (existingLabel) {
        results = results.map((item) => ({ ...item, label: existingLabel.id }));
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data: newLabel } = await supabase
          .from("labels")
          .insert({ title: label, user_id: user?.id })
          .select("id")
          .single();
        results = results.map((item) => ({
          ...item,
          label: newLabel ? newLabel.id : null,
        }));
      }
    }
    const { error } = await supabase.from(`${type}s`).insert(results);
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

export async function getSpecificOperation(
  id: string,
  type: "income" | "expense"
): Promise<SupabaseResponse<Operation>> {
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

export async function deleteOperations(
  formData: FormData
): Promise<SupabaseResponse<Operation>> {
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

export async function getLabels(
  type: OperationType
): Promise<SupabaseResponse<Label>> {
  const { data: results, error } = await supabase
    .from("labels")
    .select(`id, title, created_at, count:${type}s(count)`);

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}
