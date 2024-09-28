import toast from "@/utils/toast";
import { Button } from "@nextui-org/react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      toast({
        type: "error",
        message: error.message,
      });
    } else {
      toast({
        type: "error",
        message: "An unexpected error occurred",
      });
    }

    setIsLoading(false);
  };

  const isDisabled = isLoading || !stripe || !elements;

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        color="primary"
        type="submit"
        isDisabled={isDisabled}
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full mt-6 font-medium"
      >
        {isLoading && <l-hatch stroke={1.5} size={14} color="white" />}
        Zapłać teraz
      </Button>
    </form>
  );
}
