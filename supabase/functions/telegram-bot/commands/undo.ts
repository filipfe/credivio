import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import groupPayments from "../utils/group-payments.ts";
import { BotContext } from "../types.ts";

export default async function undo(
  ctx: CommandContext<BotContext>,
) {
  const payments = ctx.session.lastPayments;
  console.log("payments", payments);
  if (payments.length === 0) {
    await ctx.reply(
      "Nie znaleziono ostatnich operacji, spróbuj usunąć je poprzez aplikację",
    );
  }
  const grouped = groupPayments(payments);
  await Promise.all(
    Object.entries(grouped).map(async ([type, operations]) => {
      const { error } = await supabase.from(type).delete().in(
        "id",
        operations.map((o) => o.id),
      );
      if (error) {
        console.error(`Couldn't delete last ${type}`, { operations }, error);
        ctx.reply(
          `Wystąpił błąd przy usuwaniu ${
            type === "expenses" ? "wydatków" : "przychodów"
          }, spróbuj ponownie!`,
        );
      } else if (operations.length > 0) {
        ctx.session.lastPayments = ctx.session.lastPayments.filter((payment) =>
          payment.type !== type.slice(0, -1)
        );
        ctx.reply(
          `Pomyślnie usunięto ${type === "expenses" ? "wydatki" : "przychody"}:
  ${
            operations.map((item) =>
              `• ${item.title} - ${
                new Intl.NumberFormat("pl-PL", {
                  currency: item.currency,
                  style: "currency",
                }).format(item.amount)
              }`
            ).join("\n")
          }`,
        );
      }
    }),
  );
}
