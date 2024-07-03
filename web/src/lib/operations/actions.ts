"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addOperations(
  formData: FormData,
): Promise<SupabaseResponse<Operation>> {
  const type = formData.get("type")?.toString() as OperationType;
  const label = formData.get("label")?.toString();
  const data = formData.get("data")!.toString();

  try {
    let results: Operation[] = JSON.parse(data);
    const supabase = createClient();

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

    if (label) {
      results = results.map((item) => ({ ...item, label, user_id: user.id }));
    } else {
      results = results.map((item) => ({ ...item, user_id: user.id }));
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
  revalidatePath("/dashboard");
  redirect(path);
}

export async function getLatestOperations(): Promise<
  SupabaseResponse<Payment>
> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("operations")
    .select("id, title, amount, currency, type, issued_at")
    .order("issued_at", { ascending: false })
    .order("created_at", { ascending: false })
    .order("title")
    .limit(20);

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

export async function getOperationsStats(
  currency: string,
  type: string,
): Promise<SupabaseSingleRowResponse<OperationsStats>> {
  const supabase = createClient();

  const { data: result, error } = await supabase.rpc("get_operations_stats", {
    p_currency: currency,
    p_type: type,
  });

  if (error) {
    return {
      result: null,
      error: error.message,
    };
  }

  return {
    result,
  };
}

export async function getLabels(): Promise<SupabaseResponse<Label>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc("get_general_own_labels");

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

export async function getPortfolioBudgets(): Promise<SupabaseResponse<Budget>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc(
    "get_dashboard_portfolio_budgets",
  );

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

export async function updateOperation(formData: FormData) {
  try {
    const value = formData.get("operation")?.toString();
    const type = formData.get("type")?.toString();
    if (!value) {
      console.error("Edit error: Couldn't retrieve value from the form");
      return {
        error: "Niewłaściwe dane wejściowe, spróbuj ponownie!",
        results: [],
      };
    }
    const operation = JSON.parse(value) as Operation;
    const { id, ...rest } = operation;

    console.log(type, rest, id);
    const supabase = createClient();
    const { error } = await supabase.from(`${type}s`).update(rest).eq("id", id);
    if (error) {
      console.error("Edit error: While updating", error);
      return {
        error: "Wystąpił błąd, spróbuj ponownie!",
        results: [],
      };
    }

    revalidatePath(`/${type}s`);
    revalidatePath("/");
  } catch (err) {
    console.error("Edit error: Couldn't update operation", err);
    return {
      error: "Wystąpił błąd, spróbuj ponownie!",
      results: [],
    };
  }
}
