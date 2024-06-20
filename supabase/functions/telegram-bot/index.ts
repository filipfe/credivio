import { Bot, webhookCallback } from "grammy";
import registerUser from "./register-user.ts";
import insertOperations from "./insert-operations.ts";
import getUser from "./get-user.ts";
import supabase from "./supabase.ts";
import OpenAI from "openai";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error(
    `Environment variables missing: TELEGRAM_BOT_TOKEN`,
  );
}

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_TOKEN") });

const bot = new Bot(TELEGRAM_BOT_TOKEN);

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

bot.on("message:text", async (ctx) => {
  const user = await getUser(ctx.from.id);
  if (!user) {
    await registerUser(ctx);
    return;
  }
  console.log("Generating completion...", { message: ctx.msg.text });
  const textPrompt = `Analyze client's message: 
"${ctx.msg.text}"
Classify operation(s) either as 'income' or 'expense'. Generate a list of operations:

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
- if client's message is irrelevant, return empty array`;

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
    const reply = await insertOperations(data.operations, user);
    await ctx.reply(reply);
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

  const reply = await insertOperations(operations, user);

  await ctx.reply(reply);
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
