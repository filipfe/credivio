"use server";

import stripe from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";
import { createClient as createDefaultClient } from "@supabase/supabase-js";

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

  const supabaseServiceRole = createDefaultClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  const { data: subscription, error } = await supabaseServiceRole.schema(
    "stripe",
  ).from(
    "subscriptions",
  ).select("attrs")
    .eq("customer", user.id)
    .maybeSingle();

  if (error) {
    return {
      result: null,
      error: "Could not retrieve subscription",
    };
  }

  return {
    result: subscription?.attrs as Stripe.Subscription,
  };
}

export async function createSubscriptionPaymentIntent(): Promise<
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
    let subscription: Stripe.Subscription | null = null;

    const { data: subscriptions } = await stripe.subscriptions.list({
      customer: user.id,
    });
    if (!subscriptions || subscriptions.length === 0) {
      subscription = await stripe.subscriptions.create({
        "customer": user.id,
        items: [
          {
            price: "price_1Q29GeHYqwp6mI9OmhDOBQ1G",
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
      });
    } else {
      subscription = subscriptions[0];
    }

    return {
      result: ((subscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent).client_secret,
    };
  } catch (err) {
    console.log(err);
    return {
      error: "Could not retrieve or create a subscription. Please, try again.",
      result: null,
    };
  }
}
