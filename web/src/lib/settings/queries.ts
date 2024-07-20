"use client";

import { createClient } from "@/utils/supabase/client";

export async function getLanguages(): Promise<SupabaseResponse<Language>> {
  const supabase = createClient();

  const { data: results, error } = await supabase.from("languages").select(
    "code, name",
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

export async function getAccount(): Promise<Account> {
  const supabase = createClient();

  const {
    data,
    error: authError,
  } = await supabase.from("profiles").select(
    "first_name, last_name, email, language_code",
  )
    .single();

  console.log({ data });

  if (authError) {
    throw new Error(authError.message);
  }

  return data;
}

export async function getPreferences(): Promise<Preferences> {
  const supabase = createClient();

  const {
    data,
    error: authError,
  } = await supabase.from("profiles").select(
    "currency, language:languages(code, name)",
  ).single();

  if (!data || authError) {
    throw new Error("Błąd autoryzacji, spróbuj zalogować się ponownie!");
  }

  return data;
}

export async function getServices(): Promise<Service[]> {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .returns<Service[]>();
  return [];
}

export async function updateAccount(account: Partial<Account>) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("profiles").update(account).eq(
    "id",
    user?.id,
  );

  if (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }

  return {};
}
