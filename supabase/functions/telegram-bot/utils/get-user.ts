import supabase from "../supabase.ts";

export default async function getUser(
  telegram_id: number
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, first_name, telegram_id, settings(currency, language, telegram_notifications, email_notifications)"
    )
    .match({
      telegram_id,
    })
    .single();

  if (error) {
    console.error("Couldn't retrieve the user", error);
  }

  return data;
}
