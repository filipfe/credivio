"use client";

import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./checkout";
import getStripe from "@/utils/stripe/client";

interface Props {
  clientSecret: string;
}

export default function Form({ clientSecret }: Props) {
  return (
    <Elements options={{ clientSecret }} stripe={getStripe()}>
      <Checkout />
    </Elements>
  );
}
