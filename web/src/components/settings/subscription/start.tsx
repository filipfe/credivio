import { createSubscriptionPaymentIntent } from "@/lib/subscription/actions";
import Form from "./form";

export default async function Start() {
  const { result: clientSecret, error } =
    await createSubscriptionPaymentIntent();

  if (!clientSecret) {
    console.error({ error });
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-danger">Could not create payment intent</p>
      </div>
    );
  }

  return <Form clientSecret={clientSecret} />;
}
