"use server";

import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getAccount(): Promise<
  SupabaseSingleRowResponse<Account>
> {
  const supabase = createClient();

  const { data, error: authError } = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .single();

  if (authError) {
    return {
      result: null,
      error: authError.message,
    };
  }

  return {
    result: data,
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

  if (!user || authError) {
    return {
      results: [],
      error: "Błąd autoryzacji, spróbuj zalogować się ponownie!",
    };
  }

  let error: PostgrestError | null = null;

  if (isActive === "true") {
    const { error: deleteError } = await supabase
      .from("user_services")
      .delete()
      .eq("user_id", user.id)
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

export async function updatePreferences(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  const value = formData.get("value")?.toString() ?? "";

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("settings")
    .update({
      [name]: value,
    })
    .eq("user_id", user?.id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
}
