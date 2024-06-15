// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

type Body = {
  short_symbol: string;
};

Deno.serve(async (req) => {
  try {
    const { short_symbol } = (await req.json()) as Body;
    const now = new Date();
    let results = [];
    let message = "no_data";
    let nineAM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9,
      0,
      0,
      0,
    ).getTime() / 1000;
    while (message !== "ok") {
      const res = await fetch(
        `https://bossa.pl/fl_api/API/Charts/v1/history?symbol=${short_symbol}&resolution=1&from=${nineAM}&to=${
          Math.floor(
            now.getTime() / 1000,
          )
        }`,
      );
      const data = await res.json();
      message = data.s;
      results = data.s === "ok"
        ? data.t.map((time: number, k: number) => ({
          price: data.c[k],
          time,
        }))
        : [];
      nineAM -= 86400;
    }

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (_err) {
    return new Response(
      JSON.stringify({
        results: [],
        error: "Wystąpił błąd, spróbuj ponownie później!",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
