import { loadStripe, Stripe } from "@stripe/stripe-js";

const PUBLISHABLE_STRIPE_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY;

if (!PUBLISHABLE_STRIPE_KEY) {
  throw new Error(
    "Environment variables missing: NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY",
  );
}

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;
