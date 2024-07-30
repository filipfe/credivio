"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateRow(
  id: string,
  type: OperationType,
  fields: { [key: string]: any }
) {
  const supabase = createClient();
  const { error } = await supabase.from(`${type}s`).update(fields).eq("id", id);

  if (error) {
    return {
      error,
      results: [],
    };
  }

  revalidatePath(`/${type}s`);

  return {
    results: [],
  };
}

export async function deleteRows<T>({
  formData,
  body,
}: {
  formData?: FormData;
  body?: { data: string; type: string };
}): Promise<SupabaseResponse<T>> {
  let type: string;
  let data: string;
  if (formData) {
    type = formData.get("type")!.toString();
    data = formData.get("data")!.toString();
  } else {
    type = body!.type;
    data = body!.data;
  }
  try {
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
    let query = supabase.from(`${type}s`).delete();
    if (data === "all") {
      query = query.eq("user_id", user.id);
    } else {
      const ids: string[] = formData ? JSON.parse(data) : [data];
      query = query.in("id", ids);
    }
    const { error } = await query;
    if (error) {
      console.error("Couldn't delete row: ", error);
      return {
        results: [],
        error: error.message,
      };
    }
    revalidatePath(`/${type}s`);
    return {
      results: [],
    };
  } catch (err) {
    return {
      error: "Wystąpił błąd, spróbuj ponownie później!",
      results: [],
    };
  }
}

export async function insertRows<T>({
  formData,
  body,
}: {
  formData?: FormData;
  body?: { data: { [key: string]: any }; type: string };
}): Promise<SupabaseResponse<T>> {
  let type: string;
  try {
    if (formData) {
      type = formData.get("type")!.toString();
    } else {
      type = body!.type;
    }

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

    const data = formData
      ? JSON.parse(formData.get("data")!.toString())
      : body!.data;
    const { error } = await supabase
      .from(`${type}s`)
      .insert({ ...data, user_id: user.id });

    if (error) {
      return {
        results: [],
        error: error.message,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      error: "Wystąpił błąd, spróbuj ponownie później!",
      results: [],
    };
  }
  revalidatePath(`/${type}s`);
  redirect(`/${type}s`);
}
