import { Bot, session, webhookCallback } from "grammy";
import undo from "./commands/undo.ts";
import add, { insertOperations } from "./commands/add.ts";
import help from "./commands/help.ts";
import getUser from "./utils/get-user.ts";
import supabase from "./supabase.ts";
import OpenAI from "openai";
import { ADD, HELP, UNDO } from "./commands.ts";
import { freeStorage } from "grammy:storage";
import { type BotContext, type SessionData } from "./types.ts";
import registerUser from "./commands/start.ts";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    `Environment variables missing: TELEGRAM_BOT_TOKEN`,
  );
}

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_TOKEN") });

const bot = new Bot<BotContext>(TELEGRAM_BOT_TOKEN);

bot.use(
  session({
    initial: () => ({ lastPayments: [] } as SessionData),
    getSessionKey: (ctx) => ctx.from?.id.toString(),
    storage: freeStorage<SessionData>(bot.token),
  }),
);

// const menu = new Menu<BotContext>("operations-menu")
//   .text("Przychód", async (ctx) => {
//     ctx.session.type = "income";
//     await ctx.reply(
//       `Jasne!
//       Podaj tytuł i cenę`,
//     );
//   })
//   .text("Wydatek", async (ctx) => {
//     ctx.session.type = "expense";
//     console.log({ type: ctx.session.type });
//     await ctx.reply(
//       `Jasne!
// Podaj tytuł i cenę`,
//     );
//   });

// bot.use(menu);

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
    await ctx.reply(
      "Podaj swój unikalny klucz Telegram. Znajdziesz go tutaj: https://tipplet.vercel.app/automations",
    );
  }
});

Object.values(ADD).forEach((command) => {
  bot.command(command, add);
});

Object.values(UNDO).forEach((command) => {
  bot.command(command, undo);
});

Object.values(HELP).forEach((command) => {
  bot.command(command, help);
});

bot.on("message:text", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  const user = await getUser(ctx.from.id);
  if (!user) {
    await registerUser(ctx);
    return;
  }
  console.log({ user });
  const textPrompt = `Analyze client's message:
  "${ctx.msg.text}"
  Classify each operation either as 'income' or 'expense'. Generate a list of operations:
  
  type Operation = {
    title: string;
  amount: number;
  currency: string;
  type: "income" | "expense";
  };
  
  Rules:
  - return { operations: Operation[] } in json
  - create a relevant 'title' in the same language as the client's message
  - 'currency' is always 3-digit code
  - if client's message is irrelevant, return empty array
  - here's a default currency: ${user.currency}; you should use it case client didn't mention any other`;

  console.log("Generating completion...", textPrompt);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    "response_format": { type: "json_object" },
    messages: [{
      role: "user",
      "content": [
        { type: "text", text: textPrompt },
      ],
    }],
  });

  const response = completion.choices[0].message.content;

  if (typeof response !== "string") {
    console.error("Completion error: Returned a non-string response", {
      completion,
    });
    await ctx.reply(
      "Wybacz, nie mogłem przetworzyć twojego zapytania. Może spróbujesz ponownie?",
    );
    return;
  }

  try {
    const data = JSON.parse(response);
    await insertOperations(
      ctx,
      data.operations,
      user,
    );
  } catch (err) {
    console.log("Parse error: Couldn't parse the completion response", {
      response,
      err,
    });
    await ctx.reply(
      "Wybacz, nie mogłem przetworzyć twojego zapytania. Może spróbujesz ponownie?",
    );
  }
});

bot.on("message:photo", async (ctx) => {
  await ctx.replyWithChatAction("typing");

  const user = await getUser(ctx.from.id);

  if (!user) {
    ctx.reply(
      "Nie znalazłem twojego konta! Zarejestruj się, aby zapisywać operacje. Wpisz komendę /start",
    );
    return;
  }

  console.log({ user });

  const { file_path } = await ctx.getFile();

  if (!file_path) {
    ctx.reply(
      "Nie udało mi się pobrać zdjęcia. Może spróbujesz ponownie?",
    );
    return;
  }

  const split = file_path.split("/");
  const filename = split[split.length - 1];
  const format = filename.split(".").pop();

  const blob = await fetch(
    `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`,
  ).then((res) => res.blob());

  const file = new Blob([blob], {
    type: `image/${format === "jpg" ? "jpeg" : format}`,
  });

  const body = new FormData();
  body.append("user_id", user.id);
  body.append(crypto.randomUUID(), file);

  const { data, error } = await supabase.functions.invoke("process-receipt", {
    body,
  });

  if (error) {
    await ctx.reply(
      "Wystąpił błąd przy przetwarzaniu twojego zdjęcia. Może spróbujesz ponownie?",
    );
    console.error(error);
    return;
  }

  const operations = data.operations as Payment[];

  await insertOperations(ctx, operations, user);
});

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  console.log("headers", req.headers);
  try {
    const url = new URL(req.url);
    if (
      url.searchParams.get("secret") !== Deno.env.get("TELEGRAM_BOT_SECRET")
    ) {
      return new Response("Auth error: Secret is not valid", {
        status: 405,
      });
    }
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
  return new Response();
});
