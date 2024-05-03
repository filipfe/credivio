"use server";

import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function getAccount(): Promise<SupabaseResponse<Account>> {
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

  const data = {
    first_name: user?.user_metadata.first_name,
    last_name: user?.user_metadata.last_name,
    email: user?.email,
  };

  return {
    results: [{ ...data }],
  };
}

export async function updateAccount(formData: FormData) {
  const supabase = createClient();
  const data = {
    first_name: formData.get("first_name") || null,
    last_name: formData.get("last_name") || null,
  };

  const { error } = await supabase.auth.updateUser({
    data: data,
    email: formData.get("email")?.toString(),
  });

  if (error) {
    return {
      error: error.message,
    };
  }
}

export async function getPreferences(): Promise<SupabaseResponse<Preferences>> {
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

  const data = {
    currency: user?.user_metadata.currency,
    language: user?.user_metadata.language,
  };

  return {
    results: [data],
  };
}

export async function updatePreferences(name: string, value: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    data: { [name]: value },
  });

  if (error) {
    return {
      error: error.message,
    };
  }
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
