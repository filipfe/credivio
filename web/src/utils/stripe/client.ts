import { loadStripe } from "@stripe/stripe-js";

const PUBLISHABLE_STRIPE_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY;

if (!PUBLISHABLE_STRIPE_KEY) {
  throw new Error(
    "Environment variables missing: NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY",
  );
}

const stripe = loadStripe(PUBLISHABLE_STRIPE_KEY);

export default stripe;
