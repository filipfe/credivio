"use server";

import stripe from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";

export async function createPaymentIntent(): Promise<
  SupabaseSingleRowResponse<string>
> {
  const supabase = createClient();

  const { data: user, error } = await supabase.from("profiles").select(
    "id",
  ).single();

  if (error) {
    return {
      error: error.message,
      result: null,
    };
  }

  try {
    const { client_secret } = await stripe.paymentIntents.create({
      amount: 9500,
      currency: "pln",
      customer: user.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      result: client_secret,
    };
  } catch (err) {
    return {
      error: (err as Error).message,
      result: null,
    };
  }
}
