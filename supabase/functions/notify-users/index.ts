// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts";
import bot from "../_shared/telegram-bot.ts";
import { createClient } from "supabase";

type Body = {
  message?: string;
  options?: {
    graph?: "daily" | "weekly" | "monthly";
  };
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const NOTIFICATION_SECRET = Deno.env.get("NOTIFICATION_SECRET");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !NOTIFICATION_SECRET) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        NOTIFICATION_SECRET,
      }).filter(([_key, value]) => !value).map(([key]) => key).join(", ")
    }`,
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
    // send email
  }

  if (options?.graph) {
    const { data: graph } = await supabase.functions.invoke(
      "weekly-graph",
      {
        body: { user, date: new Date().toISOString() },
      },
    );
    if (!user.telegram_id || !telegram_notifications) return;
    await bot.api.sendPhoto(user.telegram_id, graph, {
      caption: message || `Cześć ${user.first_name}!
📊 Oto twój wykres wydatków z poprzedniego tygodnia na podstawie etykiet. Tak trzymaj!`,
    });
  } else {
    if (!user.telegram_id || !telegram_notifications || !message) return;
    await bot.api.sendMessage(user.telegram_id, message);
  }
};

Deno.serve(async (req) => {
  const secretKey = req.headers.get("x-secret-key");
  if (secretKey !== NOTIFICATION_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json() as Body;

  const { data: users, error } = await supabase.from("profiles")
    .select(
      "id, first_name, currency, language_code, telegram_id, settings!inner(telegram_notifications, email_notifications, graph_time)",
    )
    .or("telegram_notifications.eq.true,email_notifications.eq.true", {
      "foreignTable": "settings",
    })
    .returns<Profile[]>();

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  const now = new Date();

  const utcHours = now.getUTCHours();

  await Promise.all(
    (body.options?.graph
      ? users.filter((
        { settings: { graph_time } },
      ) => {
        const date = new Date();
        const offsetGreater = graph_time.includes("+");
        const [time, timezoneOffset] = graph_time.split(
          offsetGreater ? "+" : "-",
        );
        const [hour] = time.split(":").map(Number);
        date.setUTCHours(
          offsetGreater
            ? hour - parseInt(timezoneOffset)
            : hour + parseInt(timezoneOffset),
          0,
          0,
          0,
        );
        return date.getUTCHours() === utcHours;
      })
      : users)
      .map((user) => sendNotification(user, body)),
  );

  return new Response("ok", { status: 200 });
});
