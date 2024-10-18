"use client";

import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./checkout";
import getStripe from "@/utils/stripe/client";
import { useSettings } from "@/lib/general/queries";

export default function Form({
  client_secret: clientSecret,
  ...subscription
}: Subscription) {
  const { data: settings } = useSettings();

  return (
    <div className="px-10 py-8 border bg-light rounded-md">
      <Elements
        options={{
          clientSecret,
          appearance: {
            variables: {
              colorPrimary: "#177981",
            },
          },
        }}
        stripe={getStripe()}
      >
        <div className="flex flex-col gap-6">
          <h4 className="">Subskrypcja Monfuse</h4>
          <p className="inline-flex items-end">
            <strong className="text-2xl sm:text-3xl lg:text-4xl">
              {new Intl.NumberFormat(settings?.language, {
                style: "currency",
                currency: subscription.plan.currency,
              }).format(subscription.plan.amount / 100)}
            </strong>
            <sub className="text-sm mb-1 ml-2 opacity-80">/ miesiąc</sub>
          </p>
          <Checkout />
        </div>
      </Elements>
    </div>
  );
}
