"use server";

import stripe from "@/utils/stripe/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";
import { createClient as createDefaultClient } from "@supabase/supabase-js";

export async function getOrCreateSubscription(): Promise<
  SupabaseSingleRowResponse<Subscription>
> {
  const supabase = createClient();

  const { data: user, error: authError } = await supabase.from("profiles")
    .select(
      "id",
    ).single();

  if (authError) {
    return {
      error: authError.message,
      result: null,
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

  const { data: pastSubscription, error } = await supabaseServiceRole.schema(
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

  try {
    let client_secret: string | null = null;

    let subscription: Omit<Subscription, "plan" | "client_secret"> | null =
      pastSubscription?.attrs;

    if (!pastSubscription) {
      const newSubscription = await stripe.subscriptions.create({
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
      subscription = newSubscription;
      client_secret = ((newSubscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent).client_secret;
    } else {
      const { payment_intent } = await stripe.invoices.retrieve(
        pastSubscription.attrs.latest_invoice as string,
      );

      const paymentIntent = await stripe.paymentIntents.retrieve(
        payment_intent as string,
      );

      client_secret = paymentIntent.client_secret;
    }
    return {
      result: {
        ...subscription as Subscription,
        client_secret: client_secret as string,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      error: "Could not retrieve or create a subscription. Please, try again.",
      result: null,
    };
  }
}
