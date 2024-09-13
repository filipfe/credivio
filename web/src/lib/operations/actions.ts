"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addOperations(
  formData: FormData,
): Promise<SupabaseResponse<Operation>> {
  const type = formData.get("type")!.toString() as OperationType;
  const label = formData.get("label")?.toString() || null;
  const data = formData.get("data")?.toString();

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

  let error = null;

  if (data) {
    try {
      const operations = JSON.parse(data);
      const { error: insertError } = await supabase.rpc(
        "actions_insert_operations",
        {
          p_operations: operations,
          p_user_id: user.id,
          p_type: type,
          p_label: label,
        },
      );

      error = insertError;
    } catch (err) {
      console.warn("Couldn't parse operations: ", err);
      return {
        results: [],
        error: "Wystąpił błąd przy dodawaniu operacji, spróbuj ponownie!",
      };
    }
  } else {
    const title = formData.get("title")?.toString();
    const amount = formData.get("amount")?.toString();
    const currency = formData.get("currency")?.toString();
    const issued_at = formData.get("issued_at")?.toString();
    const description = formData.get("description")?.toString();

    const { error: insertError } = await supabase.from(`${type}s`).insert({
      title,
      amount,
      currency,
      issued_at,
      description,
      ...(type === "expense" ? { label } : {}),
    });

    error = insertError;
  }

  if (error) {
    console.error("Couldn't add operation: ", error);
    return {
      error: "Wystąpił błąd przy dodawaniu operacji, spróbuj ponownie!",
      results: [],
    };
  }

  const path = type === "expense" ? "/expenses" : "/incomes";

  revalidatePath(path);
  revalidatePath("/dashboard");
  redirect(path);
}

export async function getLatestOperations(
  from?: string,
): Promise<SupabaseResponse<Payment>> {
  const supabase = createClient();
  let query = supabase
    .from("operations")
    .select("id, title, amount, currency, type, issued_at")
    .order("issued_at", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id")
    .limit(20);

  if (from) {
    query = query.eq(`from_${from}`, true);
  }

  const { data: results, error } = await query;

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
    const id = formData.get("id")?.toString();
    const type = formData.get("type")?.toString();
    const operation = {
      title: formData.get("title")?.toString(),
      amount: formData.get("amount")?.toString(),
      issued_at: formData.get("issued_at")?.toString(),
      currency: formData.get("currency")?.toString(),
      description: formData.get("description")?.toString(),
      label: formData.get("label")?.toString(),
    };
    console.log(operation);
    const supabase = createClient();
    const { error } = await supabase
      .from(`${type}s`)
      .update(operation)
      .eq("id", id);
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
