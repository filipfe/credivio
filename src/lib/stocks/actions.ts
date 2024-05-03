"use server";

import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getStocks(
  index: GPWIndex
): Promise<SupabaseResponse<Stock>> {
  const { data } = await axios.get(
    `https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_${index}`
  );
  if (data.message !== "OK")
    return {
      results: [],
      error: "Error",
    };

  return {
    results: data._d[0]._t,
  };
}

export async function addStocks(
  formData: FormData
): Promise<SupabaseResponse<StockTransaction>> {
  const data = formData.get("data")!.toString();

  try {
    const results: StockTransaction[] = JSON.parse(data);
    const supabase = createClient();
    const { error } = await supabase.from(`stocks`).insert(results);
    console.log(error);
    if (error) {
      return {
        error: error.message,
        results: [],
      };
    }
  } catch (err) {
    return {
      error: "Parse error",
      results: [],
    };
  }

  const path = "/stocks";

  revalidatePath(path);
  revalidatePath("/");
  redirect(path);
}

export async function getDividendInfo(): Promise<SupabaseResponse<Dividend>> {
  try {
    const { data } = await axios.get(
      "https://bossa.pl/analizy/dywidendy/active"
    );
    if (!data.success)
      return {
        error: "Wystąpił błąd, spróbuj ponownie później!",
        results: [],
      };
    const results: Dividend[] = data.list.map((item: any) => {
      const {
        dividend_pln: amount,
        dividend_p_date: payment_date,
        dividend_date: date,
        dividend_ratio: ratio,
        dividend_year: for_year,
        company,
      } = item.first_element[0];
      return {
        amount,
        currency: "PLN",
        date,
        payment_date,
        ratio,
        company,
        for_year,
      };
    });
    return {
      results,
    };
  } catch (err) {
    return {
      results: [],
      error: "Wystąpił błąd, spróbuj ponownie później!",
    };
  }
}

export async function getSpecificStocks(
  list: string[]
): Promise<SupabaseResponse<Stock>> {
  try {
    const url = `https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_name/${list}`;
    const { data } = await axios.get(url);

    const results = data._d[0]._t;

    return {
      results,
    };
  } catch (err) {
    return {
      results: [],
      error: "Wystąpił błąd, spróbuj ponownie później!",
    };
  }
}

export async function getAllStocks(): Promise<SupabaseResponse<Stock>> {
  try {
    const { data } = await axios.get(
      "https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_shares"
    );

    if (data.message !== "OK") {
      return {
        results: [],
        error: "Wystąpił błąd, spróbuj ponownie później!",
      };
    }

    return {
      results: data._d[0]._t,
    };
  } catch (err) {
    return {
      results: [],
      error: "Wystąpił błąd, spróbuj ponownie później!",
    };
  }
}

export async function getPriceHistory(
  short_symbol: string
): Promise<SupabaseResponse<PriceRecord>> {
  const now = new Date();
  try {
    let results: PriceRecord[] = [];
    let message = "no_data";
    let nineAM =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        9,
        0,
        0,
        0
      ).getTime() / 1000;
    while (message !== "ok") {
      const { data } = await axios.get(
        `https://bossa.pl/fl_api/API/Charts/v1/history?symbol=${short_symbol}&resolution=1&from=${nineAM}&to=${Math.floor(
          now.getTime() / 1000
        )}`
      );
      message = data.s;
      results =
        data.s === "ok"
          ? data.t.map((time: number, k: number) => ({
              price: data.c[k],
              time,
            }))
          : [];
      nineAM -= 86400;
    }

    return {
      results,
    };
  } catch (err) {
    return {
      results: [],
      error: "Wystąpił błąd, spróbuj ponownie później!",
    };
  }
}

export async function getPricePeriod(
  short_symbol: string,
  period: string = "15T"
) {
  try {
    const { data } = await axios.get(
      `https://bossa.pl/fl_api/API/GPW/v2/Charts/${short_symbol}/${period}`
    );
    console.log(data);
    return {
      results: data._r,
    };
  } catch (err) {
    return {
      results: [],
      error: "Wystąpił błąd, spróbuj ponownie później!",
    };
  }
}
