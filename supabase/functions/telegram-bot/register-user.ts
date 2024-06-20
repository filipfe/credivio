import { Context } from "grammy";
import supabase from "./supabase.ts";

export default async function registerUser(
  ctx: Context,
) {
  const { from, text: telegramToken } = ctx.msg!;
  const { data, error } = await supabase.from("profiles").update(
    { telegram_id: from!.id },
  ).eq(
    "telegram_token",
    telegramToken,
  ).select("first_name").single();
  if (error || !data) {
    if (error.code === "PGRST116" || error.code === "22P02") {
      await ctx.reply(
        "Podano nieprawidłowy klucz Telegram, spróbuj ponownie!",
      );
    } else {
      await ctx.reply("Wystąpił błąd, spróbuj ponownie później!");
      return;
    }
    return;
  }
  await ctx.reply(
    `Cześć ${data?.first_name},
Twoja rejestracja przebiegła pomyślnie!
    
Będę tu na wypadek gdyby pojawiły się nowe operacje, które chcesz zapisać!`,
  );
}
