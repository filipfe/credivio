import { Context } from "grammy";
import supabase from "../supabase.ts";

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
Twoja rejestracja przebiegła pomyślnie!`,
  );

  await ctx.reply(
    `Możesz teraz pisać mi o swoich przychodach i wydatkach, a ja będę je zapisywać na twoim koncie!
    
Możesz również wysyłać mi zdjęcia paragonów i faktur, które przetworzę i zapiszę jako odpowiednie operacje

Aby zobaczyć dostępne komendy wpisz /pomoc

Wypróbuj dodawanie operacji wpisując komendę /dodaj`,
  );
}
