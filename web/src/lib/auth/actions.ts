"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const first_name = formData.get("first-name")?.toString();
  const last_name = formData.get("last-name")?.toString();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        language_code: "pl-PL",
        currency: "PLN",
        first_name,
        last_name,
      },
    },
  });

  if (error) {
    console.error({ error });
    return {
      error: error.message,
    };
  }

  return {};
}

export async function signIn(formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = createClient();

  await supabase.auth.signOut();

  redirect("/sign-in");
}
