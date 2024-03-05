"use server";

import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

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

export async function getOwnStocks(): Promise<
  SupabaseResponse<StockTransaction>
> {
  const { data: results, error } = await supabase.from("stocks").select("*");
  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }
  return {
    results,
  };
}

export async function addStocks(
  formData: FormData
): Promise<SupabaseResponse<StockTransaction>> {
  const method = formData.get("method")?.toString() as AddMethodKey;
  const data = formData.get("data")!.toString();

  let results: StockTransaction[] = [];

  try {
    switch (method) {
      case "csv":
        results = JSON.parse(data);
        break;
      case "manual":
        results = [JSON.parse(data)];
        break;
      default:
        return {
          error: "Nieprawidłowa metoda!",
          results,
        };
    }

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
      results,
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
  const results: Stock[] = [];
  try {
    await Promise.all(
      list.map(async (name) => {
        const { data } = await axios.get(
          `https://bossa.pl/fl_api/API/GPW/v2/Q/C/_cat_name/${name}`
        );
        results.push(data._d[0]._t[0]);
      })
    );
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
