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
  SupabaseResponse<LatestOperation>
> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("operations")
    .select("id, title, amount, currency, type, issued_at")
    .order("issued_at", { ascending: false })
    .order("created_at", { ascending: false })
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

export async function getDailyTotalAmount(
  currency: string,
  type: string,
): Promise<SupabaseResponse<DailyAmount>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc(
    "get_daily_total_amount",
    { currency, type },
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

export async function getOperationsStats(
  currency: string,
  type: string,
): Promise<SupabaseSingleRowResponse<OperationsStats>> {
  const supabase = createClient();

  const { data: results, error } = await supabase.rpc("get_operations_stats", {
    currency,
    type,
  });

  if (error) {
    return {
      results: {} as OperationsStats,
      error: error.message,
    };
  }

  return {
    results,
  };
}

export async function getDashboardStats(
  currency: string,
): Promise<SupabaseSingleRowResponse<DashboardStats>> {
  const supabase = createClient();

  const { data: results, error } = await supabase.rpc("get_dashboard_stats", {
    currency,
  });

  if (error) {
    return {
      results: {} as DashboardStats,
      error: error.message,
    };
  }

  return {
    results,
  };
}

export async function getLabels(): Promise<SupabaseResponse<Label>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc("get_own_labels");

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

export async function getAllBudgets(): Promise<SupabaseResponse<Budget>> {
  const supabase = createClient();
  const { data: results, error } = await supabase.rpc("get_all_budgets");

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

export async function getDefaultCurrency(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) "Błąd autoryzacji, spróbuj zalogować się ponownie!";

  return user?.user_metadata.currency;
}
