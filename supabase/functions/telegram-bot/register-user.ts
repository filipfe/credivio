import { Context } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
} from "grammy:conversations";
import supabase from "./supabase.ts";

export default async function registerUser(
  conversation: Conversation<Context & ConversationFlavor>,
  ctx: Context & ConversationFlavor,
) {
  let firstName: string | null = null;
  let isValid = false;
  let isFirst = true;
  let isError = false;
  do {
    conversation.log({ firstName, isValid, isFirst, isError });
    isError = false;
    await ctx.reply(
      isError
        ? "Wystąpił błąd, spróbuj ponownie później!"
        : isFirst
        ? "Podaj swój unikalny klucz Telegram. Znajdziesz go tutaj: https://tipplet.vercel.app/automations"
        : "Podano nieprawidłowy klucz Telegram, spróbuj ponownie!",
    );
    conversation.log("First reply");
    const { message, from } = await conversation.wait();
    if (!message?.text || !from) {
      conversation.log("No message");
      return;
    }
    const telegramToken = message.text;
    conversation.log({ telegramToken });
    const { data, error } = await conversation.external(() =>
      supabase.from("profiles").update(
        { telegram_id: from.id },
      ).eq(
        "telegram_token",
        telegramToken,
      ).select("first_name").single()
    );
    conversation.log({ data, error });
    if (data && !error) {
      firstName = data.first_name;
      isValid = true;
    }
    if (error) {
      isError = true;
    }
    isFirst = false;
  } while (!isValid);
  await ctx.reply(
    `Cześć ${firstName},
Twoja rejestracja przebiegła pomyślnie!
    
Będę tu na wypadek gdyby pojawiły się nowe operacje, które chcesz zapisać!`,
  );
}
