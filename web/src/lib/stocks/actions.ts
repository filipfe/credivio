"use server";

import formatError from "@/utils/supabase/format-error";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getStocks(
  index: GPWIndex,
): Promise<SupabaseResponse<Stock>> {
  const { data } = await axios.get(
    `https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_${index}`,
  );
  if (data.message !== "OK") {
    return {
      results: [],
      error: "Error",
    };
  }

  return {
    results: data._d[0]._t,
  };
}

export async function addStocks(
  formData: FormData,
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
      "https://bossa.pl/analizy/dywidendy/active",
    );
    if (!data.success) {
      return {
        error: "Wystąpił błąd, spróbuj ponownie później!",
        results: [],
      };
    }
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
  list: string[],
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
      "https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_shares",
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
  short_symbol: string,
): Promise<SupabaseResponse<PriceRecord>> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke(
    "get-stock-price-history",
    { body: { short_symbol } },
  );
  const err = await formatError(error);

  if (err) {
    return {
      error: err,
      results: [],
    };
  }

  return {
    results: data.results,
  };
}

export async function getPricePeriod(
  short_symbol: string,
  period: string = "1D",
): Promise<SupabaseResponse<number[]>> {
  try {
    const { data } = await axios.get(
      `https://bossa.pl/fl_api/API/GPW/v2/Charts/${short_symbol}/${period}`,
    );
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
