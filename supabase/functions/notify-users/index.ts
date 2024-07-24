// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts";
import bot from "../_shared/telegram-bot.ts";
import { createClient } from "supabase";

type Body = {
  message: string;
  options?: {
    graph?: "daily" | "weekly" | "monthly";
  };
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Environment variables missing: " + SUPABASE_SERVICE_ROLE_KEY
      ? "SUPABASE_SERVICE_ROLE_KEY"
      : "SUPABASE_URL",
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const sendNotification = async (user: Profile, { message, options }: Body) => {
  const { telegram_notifications, email_notifications } = user.settings;
  if (email_notifications) {
    //
  }

  if (!user.telegram_id || !telegram_notifications) return;
  if (options?.graph) {
    const { data: graph } = await supabase.functions.invoke(
      "weekly-graph",
      {
        body: { user, date: new Date().toISOString() },
      },
    );
    await bot.api.sendPhoto(user.telegram_id, graph, {
      caption: `Cześć ${user.first_name}!
📊 Oto twój wykres wydatków z obecnego tygodnia na podstawie etykiet. Tak trzymaj!`,
    });
  } else {
    await bot.api.sendMessage(user.telegram_id, message);
  }
};

Deno.serve(async (req) => {
  const body = await req.json() as Body;

  const { data: users, error } = await supabase.from("profiles").select(
    "id, first_name, currency, language_code, telegram_id, settings(telegram_notifications, email_notifications, graph_time)",
  ).returns<Profile[]>();

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  await Promise.all(users.map((user) => sendNotification(user, body)));

  return new Response("ok", { status: 200 });
});
