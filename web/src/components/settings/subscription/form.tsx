"use client";

import stripe from "@/utils/stripe/client";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./checkout";

interface Props {
  clientSecret: string;
}

export default function Form({ clientSecret }: Props) {
  return (
    <Elements options={{ clientSecret }} stripe={stripe}>
      <Checkout />
    </Elements>
  );
}
