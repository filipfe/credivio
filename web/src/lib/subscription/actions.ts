"use server";

import stripe from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

export async function getSubscription(): Promise<
  SupabaseSingleRowResponse<Stripe.Subscription>
> {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error(authError);
    return {
      result: null,
      error: "Authorization error",
    };
  }

  try {
    const { data: subscriptions } = await stripe.subscriptions.list({
      customer: user?.id,
    });
    return {
      result: subscriptions[0],
    };
  } catch (err) {
    return {
      result: null,
      error: "Could not retrieve subscription information",
    };
  }
}

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
