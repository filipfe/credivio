import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "supabase";
import { corsHeaders } from "../_shared/cors.ts";

const HCTI_API_KEY = Deno.env.get("HCTI_API_KEY");
const HCTI_USER_ID = Deno.env.get("HCTI_USER_ID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

if (!HCTI_API_KEY || !HCTI_USER_ID || !SUPABASE_ANON_KEY || !SUPABASE_URL) {
  throw new Error(
    `Environment variables missing: ${
      Object.entries({
        HCTI_API_KEY,
        HCTI_USER_ID,
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
      }).filter(([_key, value]) => !value).map(([key]) => key).join(", ")
    }`,
  );
}

type GraphProps = {
  currency: string;
  language_code: string;
  from: string;
  to: string;
  expenses: Payment[];
};

type DayProps = {
  date: Date;
  language_code: string;
  expenses: Payment[];
  weekSum: number;
  currency: string;
  labels: Record<string, { amount: number; color: string }>;
};

const colors = ["#177981", "#fdbb2d", "#40E0D0", "#ff7f50"];

const assignColors = (expenses: Payment[]) => {
  const groupedByLabel = expenses.reduce(
    (prev, { amount, label }) => ({
      ...prev,
      [label || ""]: (prev[label || ""] || 0) + amount,
    }),
    {} as Record<string, number>,
  );
  const colorMap: Record<string, { amount: number; color: string }> = {};
  Object.entries(groupedByLabel).sort(([_aL, aA], [_bL, bA]) => bA - aA)
    .forEach(([label, amount], k) => {
      colorMap[label] = {
        color: colors[k % colors.length],
        amount,
      };
    });
  return colorMap;
};

const currencyFormat = (
  { language_code, amount, currency }:
    & Pick<GraphProps, "currency" | "language_code">
    & { amount: number },
) =>
  new Intl.NumberFormat(language_code, {
    currency,
    style: "currency",
  }).format(amount);

const renderDay = (
  { date, language_code, labels, expenses, weekSum, currency }: DayProps,
) => {
  const weekday = new Intl.DateTimeFormat(language_code, {
    weekday: "short",
  }).format(date).toUpperCase();

  const groupedByLabel = expenses.reduce(
    (prev, { amount, label }) => ({
      ...prev,
      [label || ""]: (prev[label || ""] || 0) + amount,
    }),
    {} as Record<string, number>,
  );

  const daySum = Object.values(groupedByLabel).reduce(
    (prev, curr) => prev + curr,
    0,
  );

  return `
  <div class="flex flex-col gap-2 items-center">
    <div style="background-color: #FAFAFA;" class="h-72 rounded-t-md w-24 border flex flex-col overflow-hidden justify-end">
      <!-- This div height is relative to other days -->
      <div style="height: ${
    daySum / weekSum * 100
  }%;" class="relative flex flex-col-reverse">
        <h3 class="self-center absolute -top-8">${
    currencyFormat({ language_code, currency, amount: daySum })
  }</h3>
        ${
    Object.entries(groupedByLabel).sort(([_aL, aA], [_bL, bA]) => bA - aA).map((
      [label, amount],
    ) => `
          <div
            style="background-color: ${labels[label].color}; height: ${
      amount / daySum * 100
    }%;"
            class="flex flex-col gap-2 text-white items-center justify-center w-full"
          ></div>
          `).join("")
  }
      </div> 
    </div>
    <h2 class="font-bold">${weekday}</h2>
  </div>
  `;
};

const renderGraph = (
  { from, to, language_code, expenses, currency }: GraphProps,
) => {
  const days = getDateArray(from, to);
  const weekSum = expenses.reduce((prev, { amount }) => prev + amount, 0);
  const labels = assignColors(expenses);

  return `
  <!DOCTYPE html>
    <html lang=${language_code.split("-")[0]}>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^2.0/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body>
        <div id="wrapper" class="mx-auto max-w-7xl rounded border px-10 py-12">
          <div class="flex w-full items-center justify-center gap-12">
            <div class="flex flex-col items-start">
              <div class="flex gap-4 w-full text-base leading-normal text-black">
                <div class="border-r mb-9 mr-3 flex flex-col justify-between items-end self-stretch">
                  <div class="relative flex h-px min-w-max items-center border-b pr-2">
                    <div class="bg-white px-0.5">
                      <p class="mr-2 min-w-max text-sm font-semibold leading-none">${
    currencyFormat({ currency, language_code, amount: weekSum })
  }</p>
                    </div>
                  </div>
                  <div class="relative flex h-px min-w-max items-center border-b pr-2">
                    <div class="bg-white px-0.5">
                      <p class="mr-2 min-w-max text-sm font-semibold leading-none">${
    currencyFormat({ currency, language_code, amount: Math.floor(weekSum / 2) })
  }</p>
                    </div>
                  </div>
                  <div class="relative flex h-px min-w-max items-center border-b pr-2">
                    <div class="bg-white px-0.5">
                      <p class="mr-2 min-w-max text-sm font-semibold leading-none">${
    currencyFormat({ currency, language_code, amount: 0 })
  }</p>
                    </div>
                  </div>
                </div>
                ${
    days.map((day) =>
      renderDay({
        date: day,
        language_code,
        weekSum,
        currency,
        expenses: expenses.filter((item) =>
          new Date(item.issued_at).toDateString() === day.toDateString()
        ),
        labels,
      })
    ).join(
      "",
    )
  }
              </div>
            </div>
            <div class="flex flex-col gap-8">
              <div class='flex flex-col gap-0.5'>
                <p class="text-lg text-black">Wydano</p>
                <h3 class="text-5xl font-bold text-black">
                  ${
    currencyFormat({ language_code, currency, amount: weekSum })
  }
                </h3>
              </div>
              <div>
                ${
    Object.entries(labels).map(([label, { color, amount }]) => `
                  <div class="flex items-center gap-2">
                    <div style="background-color: ${color};" class="h-3 w-5 rounded"></div>
                    <h4 class="mb-1 font-semibold">${label}</h4>
                    <span class="opacity-80 text-sm font-medium">(${
      currencyFormat({ language_code, amount, currency })
    })</span>
                  </div>
                `).join("")
  }
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`;
};

const getDateArray = (from: string, to: string) => {
  const dateArray: Date[] = [];
  const startDate = new Date(from);
  const endDate = new Date(to);
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Push a new Date object so that we don't reference the same date
    dateArray.push(new Date(currentDate));
    // Add one day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

const getWeekPeriod = (date: Date) => {
  const startOfWeek = new Date(date);
  const currentDayOfWeek = date.getDay();
  const startDiff = date.getDate() - currentDayOfWeek +
    (currentDayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(startDiff);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return {
    from: `${startOfWeek.getFullYear()}-${
      startOfWeek.getMonth() + 1
    }-${startOfWeek.getDate()}`,
    to: `${endOfWeek.getFullYear()}-${
      endOfWeek.getMonth() + 1
    }-${endOfWeek.getDate()}`,
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { date } = await req.json();

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 422,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { from, to } = getWeekPeriod(new Date(date));

  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select(
      "language_code, currency",
    ).single();

  profileError && console.error(profileError);

  const { data: expenses, error } = await supabase.from("expenses").select(
    "amount, label, issued_at",
  ).gte("issued_at", from).lte("issued_at", to).eq(
    "currency",
    profile?.currency || "PLN",
  ).returns<Payment[]>();

  console.log({ expenses, error });

  if (error) {
    console.error("Couldn't get expenses: ", error);
    return new Response(
      JSON.stringify({
        message: "There was a problem gathering expenses",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }

  const html = renderGraph({
    language_code: profile?.language_code,
    from,
    to,
    expenses,
    currency: profile?.currency,
  });

  const response = await fetch("https://hcti.io/v1/image", {
    method: "POST",
    body: JSON.stringify({
      html,
      selector: "div[id='wrapper']",
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(HCTI_USER_ID + ":" + HCTI_API_KEY)}`,
    },
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        message: response.statusText ||
          "There was an error generating a graph",
      }),
      {
        ...response,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const data = await response.json();

  return new Response(
    data.url,
    { headers: corsHeaders },
  );
});
