import { Bot, Context, session, SessionFlavor, webhookCallback } from "grammy";
import {
  ConversationFlavor,
  conversations,
  createConversation,
} from "grammy:conversations";
import registerUser from "./register-user.ts";
import getUser from "./get-user.ts";
// import supabase from "./supabase.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    `Environment variables missing: TELEGRAM_BOT_TOKEN`,
  );
}

const bot = new Bot<Context & SessionFlavor<{}> & ConversationFlavor>(
  TELEGRAM_BOT_TOKEN!,
);

bot.use(session({
  initial: () => ({}),
}));

bot.use(conversations());

bot.use(
  createConversation(
    registerUser,
    "register-user",
  ),
);

bot.command("start", async (ctx) => {
  if (!ctx.from) {
    await ctx.reply(
      "Nie posiadam uprawnień do zidentyfikowania kim jesteś. Spróbuj zmienić ustawienia profilu Telegram.",
    );
    return;
  }
  const user = await getUser(ctx.from.id);
  if (user) {
    await ctx.reply(
      `Cześć ${user.first_name}! Rejestracja została już wykonana`,
    );
  } else {
    await ctx.conversation.enter("register-user");
  }
});

bot.on("message:photo", async (ctx) => {
  const user = await getUser(ctx.from.id);
  if (!user) {
    ctx.reply(
      "Nie znalaziono konta. Zarejestruj się, aby zapisywać operacje. Wpisz komendę /start",
    );
    return;
  }

  const { file_path } = await ctx.getFile();
  if (!file_path) {
    ctx.reply(
      "Nie udało się pobrać zdjęcia. Spróbuj ponownie!",
    );
    return;
  }

  // const arrayBuffer = await fetch(
  //   `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`,
  // ).then((res) => res.arrayBuffer());
  console.log(
    `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`,
  );
  // const body = new FormData();
  // body.append("user_id", user_id);
  // body.append(crypto.randomUUID(), { ...blob });
  // const { data, error } = await supabase.functions.invoke("process-receipt", {
  //   body,
  // });
  // if (error) {
  //   console.error(error);
  //   return;
  // }
  // const operations = (data.operations as Payment[]).reduce(
  //   (prev, curr) => ({
  //     ...prev,
  //     [`${curr.type}s`]: [...prev[`${curr.type}s` as keyof typeof prev], curr],
  //   }),
  //   { incomes: [] as Payment[], expenses: [] as Payment[] },
  // );
  // const inserted = await Promise.all(
  //   Object.entries(operations).map(async ([key, value]) => {
  //     const { data, error } = await supabase.from(key).insert(
  //       value.map((operation) => ({ ...operation, user_id, from_telegram: true })),
  //     ).select().returns<Payment[]>().single();
  //     error && console.error(error);
  //     return data;
  //   }),
  // );
  // const succeeded = inserted.filter((item) => item !== null) as Payment[];
  // await ctx.reply(
  //   succeeded.length === 0
  //     ? "Nie dodano operacji, spróbuj ponownie!"
  //     : `Dodano następujące operacje:
  // ${
  //       succeeded.map(({ title, amount, currency }) =>
  //         `${title} ${
  //           new Intl.NumberFormat("pl-PL", { currency, style: "currency" })
  //             .format(amount)
  //         }`
  //       ).join("\n")
  //     }`,
  // );
});

bot.start();

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (
      url.searchParams.get("secret") !== Deno.env.get("TELEGRAM_BOT_SECRET")
    ) {
      return new Response("Auth error: Secret is not valid", { status: 405 });
    }
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
  return new Response();
});
