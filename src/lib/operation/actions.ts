"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

export async function addOperations(
  formData: FormData
): Promise<SupabaseResponse<Operation>> {
  const type = formData.get("type")?.toString() as OperationType;
  const label = formData.get("label")?.toString();
  const data = formData.get("data")!.toString();

  try {
    let results: Operation[] = JSON.parse(data);
    if (label) {
      const { data: existingLabel } = await supabase
        .from("labels")
        .select("id")
        .eq("title", label)
        .single();
      if (existingLabel) {
        results = results.map((item) => ({ ...item, label: existingLabel.id }));
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data: newLabel } = await supabase
          .from("labels")
          .insert({ title: label, user_id: user?.id })
          .select("id")
          .single();
        results = results.map((item) => ({
          ...item,
          label: newLabel ? newLabel.id : null,
        }));
      }
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
  revalidatePath("/");
  redirect(path);
}

export async function getLabels(
  type: OperationType
): Promise<SupabaseResponse<Label>> {
  const { data: results, error } = await supabase
    .from("labels")
    .select(`id, title, created_at, count:${type}s(count)`);

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
