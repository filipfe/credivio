import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import getUser from "../utils/get-user.ts";
import { BotContext } from "../../_shared/telegram-bot.ts";

export default async function graph(ctx: CommandContext<BotContext>) {
  if (!ctx.from) {
    await ctx.reply(
      "Nie posiadam uprawnień do zidentyfikowania kim jesteś. Spróbuj zmienić ustawienia profilu Telegram.",
    );
    return;
  }
  await ctx.replyWithChatAction("typing");
  const user = await getUser(ctx.from.id);
  if (user) {
    const date = ctx.msg.date * 1000;
    const { data, error } = await supabase.functions.invoke("weekly-graph", {
      body: {
        date,
        user,
      },
    });
    if (error) {
      console.error(error);
      await ctx.reply("Wystąpił błąd, spróbuj ponownie!");
    } else {
      await ctx.replyWithPhoto(data, {
        caption:
          "📊 Oto twój wykres wydatków z obecnego tygodnia na podstawie etykiet",
      });
    }
  } else {
    await ctx.reply("Zarejestruj się, aby kontynuować! Wpisz komendę /start");
  }
}
