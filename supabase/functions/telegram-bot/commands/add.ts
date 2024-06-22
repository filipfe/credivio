import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import { BotContext, Profile } from "../types.ts";
import groupPayments from "../utils/group-payments.ts";
import getUser from "../utils/get-user.ts";

const constructReply = (operations: Payment[]) =>
  `Dodałem następujące operacje:
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

export async function insertOperations(
  ctx: BotContext,
  operations: Payment[],
  user: Profile,
  type?: "income" | "expense",
) {
  ctx.session.lastPayments = [];
  const grouped = groupPayments(
    type ? operations.map((op) => ({ ...op, type })) : operations,
    {
      user_id: user.id,
      from_telegram: true,
      issued_at: new Date().toISOString(),
    },
  );

  const inserted = (await Promise.all(
    Object.entries(grouped).flatMap(async ([key, values]) => {
      const { data, error: insertError } = await supabase.from(key).insert(
        values,
      ).select("*").returns<Payment[]>();
      if (!insertError && data) {
        ctx.session.lastPayments = [
          ...ctx.session.lastPayments,
          ...data.map((operation) => ({
            ...operation,
            type: key.slice(0, -1) as "income" | "expense",
          })),
        ];
      } else {
        console.error({ insertError });
      }
      return data
        ? data.map((item) => ({ ...item, type: key.slice(0, -1) }))
        : [];
    }),
  )).filter((arr) => arr !== null).flatMap((arr) => arr) as Payment[];

  console.log({ inserted });

  const reply = inserted.length > 0
    ? constructReply(inserted)
    : "Nie dodano operacji, spróbuj ponownie!";
  return reply;
}

export default async function add(ctx: CommandContext<BotContext>) {
  if (!ctx.from) {
    await ctx.reply(
      "Nie posiadam uprawnień do zidentyfikowania kim jesteś. Spróbuj zmienić ustawienia profilu Telegram.",
    );
    return;
  }
  const user = await getUser(ctx.from.id);
  if (user) {
    // await ctx.reply("Wybierz typ operacji:", { reply_markup: menu });
  } else {
    await ctx.reply("Zarejestruj się, aby kontynuować! Wpisz komendę /start");
  }
}
