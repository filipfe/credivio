import supabase from "../supabase.ts";

export default async function getUser(
  telegram_id: number,
): Promise<{ id: string; first_name: string; currency: string } | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, first_name, currency")
    .match({
      telegram_id,
    })
    .single();

  return data || null;
}
