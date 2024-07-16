import { CommandContext } from "grammy";
import { BotContext } from "../types.ts";
import supabase from "../supabase.ts";

export default async function graph(ctx: CommandContext<BotContext>) {
  await ctx.replyWithChatAction("typing");
  const date = ctx.msg.date * 1000;
  const { data, error } = await supabase.functions.invoke("weekly-graph", {
    body: {
      date,
    },
  });
  if (error) {
    await ctx.reply("Wystąpił błąd, spróbuj ponownie!");
  } else {
    await ctx.replyWithPhoto(data, {
      caption:
        "📊 Oto twój wykres wydatków z obecnego tygodnia na podstawie etykiet",
    });
  }
}
