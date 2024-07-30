"use server";

import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getOwnStocks(
  searchParams?: SearchParams,
  limit?: number
): Promise<SupabaseResponse<StockTransaction>> {
  const supabase = createClient();

  const { data: result, error } = await supabase.rpc("get_stocks_own_rows", {
    p_limit: limit,
    p_page: searchParams?.page,
    p_sort: searchParams?.sort,
    p_search: searchParams?.search,
    p_transaction_type: searchParams?.transaction,
    p_currency: searchParams?.currency,
    p_from: searchParams?.from,
    p_to: searchParams?.to,
  });

  if (error) {
    throw new Error(error.message);
  }

  return result;
}

export async function getHoldings(
  limit?: number
): Promise<SupabaseSingleRowResponse<Holdings>> {
  const supabase = createClient();

  const { data: result, error } = await supabase.rpc("get_stocks_holdings", {
    p_limit: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { result };
}

export async function getStocks(
  index: GPWIndex
): Promise<SupabaseResponse<Stock>> {
  const { data } = await axios.get(
    `https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_${index}`
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
  formData: FormData
): Promise<SupabaseResponse<StockTransaction>> {
  const data = formData.get("data")!.toString();

  try {
    const results: StockTransaction[] = JSON.parse(data);
    const supabase = createClient();
    const { error } = await supabase.from(`stocks`).insert(results);

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

export async function getPricePeriod(
  short_symbol: string,
  period: string = "1D"
): Promise<SupabaseResponse<number[]>> {
  try {
    const { data } = await axios.get(
      `https://bossa.pl/fl_api/API/GPW/v2/Charts/${short_symbol}/${period}`
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
