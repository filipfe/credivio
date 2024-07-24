import supabase from "../supabase.ts";

export default async function getUser(
  telegram_id: number,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, currency, language_code, telegram_id")
    .match({
      telegram_id,
    })
    .single();

  if (error) {
    console.error("Couldn't retrieve the user", error);
  }

  return data;
}
