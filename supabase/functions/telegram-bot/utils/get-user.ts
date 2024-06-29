import supabase from "../supabase.ts";
import { Profile } from "../types.ts";

export default async function getUser(
  telegram_id: number,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, currency, language_code")
    .match({
      telegram_id,
    })
    .single();

  if (error) {
    console.error("Couldn't retrieve the user", error);
  }

  return data;
}
