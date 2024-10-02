// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import openai from "../_shared/openai.ts";
import prompts from "./prompt.ts";
import { Body } from "./types.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { input, ...context } = await req.json() as Body;

  console.log(input, context);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: prompts.system,
      },
      {
        role: "user",
        content: prompts.user(input, JSON.stringify(context), "pl-PL"),
      },
    ],
  });

  console.log(completion.choices[0].message.content);

  return new Response(
    // JSON.stringify({ message: "" }),
    JSON.stringify({ message: completion.choices[0].message.content }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
