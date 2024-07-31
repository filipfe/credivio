import getUser from "../utils/get-user.ts";
import { ADD, GRAPH, UNDO } from "../commands.ts";
import { BotContext } from "../../_shared/telegram-bot.ts";

export default async function help(ctx: BotContext) {
  if (!ctx.from) {
    await ctx.reply(
      "Nie posiadam uprawnień do zidentyfikowania kim jesteś. Spróbuj zmienić ustawienia profilu Telegram.",
    );
    return;
  }
  const user = await getUser(ctx.from.id);
  if (user) {
    await ctx.reply(
      `🔎 Oto lista wszystkich dostępnych komend:
/${ADD[user.language_code as keyof typeof ADD]} - Dodaj nową operację
/${UNDO[user.language_code as keyof typeof UNDO]} - Cofnij ostatnią operację
/${
        GRAPH[user.language_code as keyof typeof GRAPH]
      } - Wygeneruj tygodniowy wykres wydatków`,
    );
  } else {
    await ctx.reply("Zarejestruj się, aby kontynuować! Wpisz komendę /start");
  }
}
