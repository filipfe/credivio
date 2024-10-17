import supabase from "../supabase.ts";
import { BotContext } from "../../_shared/telegram-bot.ts";

export default async function registerUser(
  ctx: BotContext,
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
      await ctx.reply(ctx.t("global.invalid-token"));
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
    
Możesz również wysyłać mi zdjęcia paragonów i faktur, które przetworzę i zapiszę jako odpowiednie operacje lub wysyłać mi wiadomości głosowe z informacjami o operacjach

Aby zobaczyć dostępne komendy wpisz /pomoc

Wypróbuj dodawanie operacji wpisując komendę /dodaj`,
  );
}
