"use server";

import stripe from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

export async function getSubscription(): Promise<
  SupabaseSingleRowResponse<Stripe.Subscription>
> {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) {
    console.error(authError);
    return {
      result: null,
      error: "Authorization error",
    };
  }

  const { data: subscription, error } = await supabase.schema("stripe").from(
    "subscriptions",
  ).select("status")
    .eq("customer", user.id)
    .returns<Stripe.Subscription>()
    .maybeSingle();

  if (error) {
    return {
      result: null,
      error: "Could not retrieve subscription",
    };
  }

  return {
    result: subscription,
  };
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
