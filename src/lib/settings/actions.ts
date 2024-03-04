"use server";

import { Account } from "@/types/auth";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function getAccount(): Promise<SupabaseResponse<Account>> {
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
