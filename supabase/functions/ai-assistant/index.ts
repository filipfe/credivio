// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import openai from "../_shared/openai.ts";
import prompts from "./prompt.ts";
import { Body } from "./types.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "supabase";
import { Payment } from "../_shared/types.ts";
import { toZonedTime } from "npm:date-fns-tz";
import {
  endOfDay,
  intervalToDuration,
  parseISO,
  startOfDay,
} from "npm:date-fns";
import functions from "./functions.ts";
import { ChatCompletionMessageParam } from "https://deno.land/x/openai@v4.51.0/resources/chat/completions.ts";
import { OperationsType } from "./types.ts";
import { fromZonedTime } from "npm:date-fns-tz";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
      })
        .filter(([_key, value]) => !value)
        .map(([key]) => key)
        .join(", ")
    }`,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response("Authorization header missing", { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data: settings, error } = await supabase.from("settings").select(
    "language, timezone",
  ).returns<Profile["settings"][]>().single();

  if (error) {
    return new Response("Couldn't retrieve settings", { status: 500 });
  }

  const { input, currency, ...context } = await req.json() as Body;

  const getOperations = async (
    type: OperationsType,
    from: string,
    to: string,
  ) => {
    const start = fromZonedTime(startOfDay(parseISO(from)), settings.timezone);
    const end = fromZonedTime(endOfDay(parseISO(to)), settings.timezone);
    const { months } = intervalToDuration({
      start: start.toUTCString(),
      end: end.toUTCString(),
    });
    if ((months || 0) > 1) {
      return {
        results: [],
        error: "Difference between start and end date cannot exceeed 31 days",
      };
    }
    const cols: (keyof Payment)[] = [
      "title",
      "amount",
      "issued_at",
      "recurring",
    ];
    const { data, error } = await supabase.from(type)
      .select(
        type === "expenses" ? [...cols, "label"].join(", ") : cols.join(", "),
      )
      .eq("currency", currency)
      .gte("issued_at", start.toUTCString())
      .lte("issued_at", end.toUTCString());

    if (error) {
      return {
        error: "ERROR: " + error.message,
        results: {},
      };
    }

    return {
      results: data,
    };
  };

  async function getRecurringPayments() {
    const { data, error } = await supabase.from("recurring_payments")
      .select("title, type, amount, interval_amount, interval_unit, start_date")
      .eq("currency", currency);

    if (error) {
      return {
        error: "ERROR: " + error.message,
        results: {},
      };
    }

    return {
      results: data,
    };
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: prompts.system(JSON.stringify(context), settings),
    },
    {
      role: "user",
      content: input,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tool_choice:
      context.operations && Object.values(context.operations).some((v) =>
          v === true
        )
        ? "required"
        : "none",
    tools: Object.values(functions).map((func) => ({
      function: func,
      type: "function",
    })),
  });

  const choice = completion.choices[0];

  if (choice.finish_reason === "tool_calls") {
    if (!choice.message.tool_calls) {
      return new Response("Internal server error", { status: 500 });
    }
    messages.push(choice.message);
    for (const tool_call of choice.message.tool_calls) {
      console.log("Function call: ", tool_call);
      const { function: { name, arguments: args }, id } = tool_call;
      if (name === "get_recurring_payments") {
        const { results, error } = await getRecurringPayments();
        messages.push({
          tool_call_id: id,
          content: error || JSON.stringify(results),
          role: "tool",
        });
      } else {
        const { from, to } = JSON.parse(args);
        const type = name.replace("get_", "") as OperationsType;
        const { results, error } = await getOperations(type, from, to);
        messages.push({
          tool_call_id: id,
          content: error || JSON.stringify(results),
          role: "tool",
        });
      }
    }

    const finalCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    return new Response(
      // JSON.stringify({ message: "" }),
      JSON.stringify({ message: finalCompletion.choices[0].message.content }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  return new Response(
    // JSON.stringify({ message: "" }),
    JSON.stringify({ message: choice.message.content }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
