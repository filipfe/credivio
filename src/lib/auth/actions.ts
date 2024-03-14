"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithEmail(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get("email")?.toString() || "",
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  return error;
}

export async function signOut() {
  const supabase = createClient();

  await supabase.auth.signOut();

  redirect("/sign-in");
}
