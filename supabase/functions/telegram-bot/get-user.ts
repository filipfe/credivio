import supabase from "./supabase.ts";

export default async function getUser(
  telegram_id: number,
): Promise<{ id: string; first_name: string } | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, first_name")
    .match({
      telegram_id,
    })
    .single();

  return data || null;
}
