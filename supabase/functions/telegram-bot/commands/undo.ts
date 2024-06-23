import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import { BotContext } from "../types.ts";

const constructReply = (operations: Payment[]) =>
  `🔄 Pomyślnie usunięto następujące operacje:
${
    operations.map(({ title, amount, type, currency }) =>
      `• ${type === "expense" ? "Wydatek" : "Przychód"}: ${title} - ${
        new Intl.NumberFormat("pl-PL", {
          currency,
          style: "currency",
        }).format(amount)
      }`
    ).join("\n")
  }`;

export default async function undo(
  ctx: CommandContext<BotContext>,
) {
  const lastPayments = ctx.session.lastPayments;

  console.log("Last payments: ", lastPayments);

  if (lastPayments.length === 0) {
    await ctx.reply(
      "Nie znaleziono ostatnich operacji, spróbuj usunąć je poprzez aplikację",
    );
  }

  const { data, error } = await supabase.rpc("delete_operations", {
    p_ids: lastPayments,
  });

  if (error || !data) {
    console.error("Couldn't delete operations: ", error);
    await ctx.reply(
      "Wystąpił błąd, spróbuj ponownie lub usuń operacje poprzez aplikacje",
    );
  } else {
    await ctx.reply(constructReply(data));
  }
  // const grouped = groupPayments(payments);
  // await Promise.all(
  //   Object.entries(grouped).map(async ([type, operations]) => {
  //     const { error } = await supabase.from(type).delete().in(
  //       "id",
  //       operations.map((o) => o.id),
  //     );
  //     if (error) {
  //       console.error(`Couldn't delete last ${type}`, { operations }, error);
  //       ctx.reply(
  //         `Wystąpił błąd przy usuwaniu ${
  //           type === "expenses" ? "wydatków" : "przychodów"
  //         }, spróbuj ponownie!`,
  //       );
  //     } else if (operations.length > 0) {
  //       ctx.session.lastPayments = ctx.session.lastPayments.filter((payment) =>
  //         payment.type !== type.slice(0, -1)
  //       );
  //       ctx.reply(
  //         `Pomyślnie usunięto ${type === "expenses" ? "wydatki" : "przychody"}:
  // ${
  //           operations.map((item) =>
  //             `• ${item.title} - ${
  //               new Intl.NumberFormat("pl-PL", {
  //                 currency: item.currency,
  //                 style: "currency",
  //               }).format(item.amount)
  //             }`
  //           ).join("\n")
  //         }`,
  //       );
  //     }
  //   }),
  // );
}
