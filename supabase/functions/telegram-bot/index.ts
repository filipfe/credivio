import {
  Bot,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.24.1/mod.ts";
import { createClient } from "supabase";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!TELEGRAM_BOT_TOKEN || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        TELEGRAM_BOT_TOKEN,
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
      })
        .filter(([_k, value]) => !value).map(([key]) => key).join(", ")
    }`,
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const bot = new Bot(TELEGRAM_BOT_TOKEN);

async function getUserId(telegram_id: number): Promise<string | null> {
  const { data } = await supabase.from("profiles").select("id").match({
    telegram_id,
  }).single();
  return data?.id || null;
}

bot.on("message:photo", async (ctx) => {
  const user_id = await getUserId(ctx.from.id);
  if (!user_id) throw new Error("Auth error: Couldn't find a matching profile");
  const { file_path } = await ctx.getFile();
  if (!file_path) throw new Error("Error: Couldn't retrieve the photo");
  const blob = await fetch(
    `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file_path}`,
  ).then((res) => res.blob());
  const body = new FormData();
  body.append(crypto.randomUUID(), blob);
  const { data, error } = await supabase.functions.invoke("process-receipt", {
    body,
  });
  if (error) {
    console.error(error);
    return;
  }
  const operations = (data.operations as Operation[]).reduce(
    (prev, curr) => ({
      ...prev,
      [`${curr.type}s`]: [...prev[`${curr.type}s` as keyof typeof prev], curr],
    }),
    { incomes: [] as Operation[], expenses: [] as Operation[] },
  );
  await Promise.all(
    Object.entries(operations).map(async ([key, value]) =>
      await supabase.from(key).insert(
        value.map((operation) => ({ ...operation, user_id })),
      )
    ),
  );
});

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
    return new Response(err, { status: 500 });
  }
});
