"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithEmail(formData: FormData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: formData.get("email") as string,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3000",
    },
  });
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  redirect("/sign-in");
}
