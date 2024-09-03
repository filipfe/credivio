import { createClient } from "@/utils/supabase/client";

export async function getPastRecurringPayments(
  params: SearchParams,
): Promise<Payment[]> {
  console.log(params.page);
  const supabase = createClient();
  let query = supabase
    // .rpc("get_recurring_payments_timeline_data", {
    //   p_offset: typeof params.page === "number" ? (params.page + 1) * 8 : 0,
    // })
    .from("operations").select("id, title, amount, currency, type, issued_at")
    .eq("recurring", true).order("issued_at", { ascending: false })
    .returns<Year[]>();

  if (typeof params.page === "number") {
    query = query.range(8 * params.page, (params.page * 8) + 8);
  }

  const { data, error } = await query;

  console.log(data, error);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
