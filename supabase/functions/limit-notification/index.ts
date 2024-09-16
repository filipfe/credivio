import { createClient } from "supabase";
import "https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts";
import bot from "../_shared/telegram-bot.ts";
import { breakpoints } from "./dict.ts";
import { type Breakpoint } from "./types.ts";

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

type Body = {
  record: Payment;
  type: "income" | "expense";
};

type Limit = {
  amount: number;
  currency: string;
  period: "daily" | "weekly" | "monthly";
  total: number;
};

const sendNotification = async (
  profile: Preferences & Settings,
  limit: Limit,
  breakpoint: Breakpoint,
) => {
  await bot.api.sendMessage(
    profile.telegram_id,
    breakpoint.messages[profile.language.code](limit),
  );
};

Deno.serve(async (req) => {
  const { record: { currency, title, recurring, amount, user_id }, type } =
    await req
      .json() as Body;

  const { data: profile, error: profileError } = await supabase.from(
    "profiles",
  ).select("telegram_id, language:languages(code)").eq("id", user_id).returns<
    (Preferences & Settings)[]
  >()
    .single();

  if (profileError) {
    console.warn("Couldn't retrieve telegram_id: ", profileError);
    return new Response(JSON.stringify(profileError), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (recurring) {
    await bot.api.sendMessage(
      profile.telegram_id,
      `Dodano ${
        type === "income" ? "przychód" : "wydatek"
      } cykliczny ${title} w kwocie ${
        new Intl.NumberFormat(profile.language.code, {
          style: "currency",
          currency,
        }).format(amount)
      }`,
    );
  }

  if (type === "income") {
    return new Response("ok", { status: 200 });
  }

  const { data: limits, error: limitsError } = await supabase.rpc(
    "get_expenses_limits",
    {
      p_currency: currency,
      p_user_id: user_id,
    },
  ).returns<Limit[]>();

  if (limitsError) {
    console.warn("Couldn't retrieve limits: ", limitsError);
    return new Response(JSON.stringify(limitsError), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (limits.length > 0) {
    await Promise.all(
      limits.reduce((prev, limit) => {
        const paidPercentage = (limit.total / limit.amount) * 100;
        const noCurrentPaidPercentage =
          ((limit.total - amount) / limit.amount) * 100;
        const exceededBreakpoint = breakpoints.find((breakpoint) =>
          paidPercentage >= breakpoint.value &&
          noCurrentPaidPercentage < breakpoint.value
        );

        if (!exceededBreakpoint) {
          return prev;
        }

        return [
          ...prev,
          sendNotification(profile, { ...limit, currency }, exceededBreakpoint),
        ];
      }, [] as Promise<void>[]),
    );
  }

  return new Response("ok", { status: 200 });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/limit-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
