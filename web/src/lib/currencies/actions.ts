import axios from "axios";

export async function getCurrencies(): Promise<SupabaseResponse<Currency>> {
  try {
    const { data: results } = await axios.get(
      "https://bossa.pl/fl_api/API/FX/v1/Q/Currencies"
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
