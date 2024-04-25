"use server";

import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getAccount(): Promise<SupabaseResponse<Account>> {
  const supabase = createClient();
  const { data: account, error: accountError } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .single();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const error = accountError?.message || userError?.message;

  if (error) {
    return {
      error,
      results: [],
    };
  }

  if (user && account) {
    return {
      results: [{ ...user, ...account }],
    };
  }

  return {
    error: "Not found",
    results: [],
  };
}

export async function activateService(
  formData: FormData
): Promise<SupabaseResponse<any>> {
  const service = formData.get("service")!.toString();
  const isActive = formData.get("is-active")!.toString();
  const { id, href } = JSON.parse(service);

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return {
      error: authError.message,
      results: [],
    };
  }

  let error: PostgrestError | null = null;

  if (isActive === "true") {
    const { error: deleteError } = await supabase
      .from("user_services")
      .delete()
      .eq("user_id", user?.id)
      .eq("service_id", id);
    error = deleteError;
  } else {
    const { error: insertError } = await supabase
      .from("user_services")
      .insert({ service_id: id, user_id: user?.id });
    error = insertError;
  }

  if (error) {
    return {
      error: error.message,
      results: [],
    };
  }

  revalidatePath("/settings/subscription");
  revalidatePath(href || "");

  return {
    results: [],
  };
}
