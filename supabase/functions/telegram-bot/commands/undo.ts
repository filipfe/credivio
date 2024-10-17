import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import { BotContext } from "../../_shared/telegram-bot.ts";
import { Payment } from "../../_shared/types.ts";

const constructReply = (operations: Payment[]) =>
  `🔄 Pomyślnie usunięto następujące operacje:
${
    operations
      .map(
        ({ title, amount, type, currency }) =>
          `• ${type === "expense" ? "Wydatek" : "Przychód"}: ${title} - ${
            new Intl.NumberFormat("pl-PL", {
              currency,
              style: "currency",
            }).format(amount)
          }`,
      )
      .join("\n")
  }`;

export default async function undo(ctx: CommandContext<BotContext>) {
  const lastPayments = ctx.session.lastPayments;

  console.log("Last payments: ", lastPayments);

  if (lastPayments.length === 0) {
    await ctx.reply(
      "Nie znaleziono ostatnich operacji, spróbuj usunąć je poprzez aplikację",
    );
    return;
  }

  const { data, error } = await supabase.rpc("actions_delete_operations", {
    p_ids: lastPayments,
  });

  if (error || !data) {
    console.error("Couldn't delete operations: ", error);
    await ctx.reply(
      "Wystąpił błąd, spróbuj ponownie lub usuń operacje poprzez aplikacje",
    );
  } else {
    await ctx.reply(constructReply(data));
    ctx.session.lastPayments = [];
  }
}
