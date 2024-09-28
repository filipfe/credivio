import Form from "@/components/settings/subscription/form";
import { createPaymentIntent } from "@/lib/subscription/actions";
import { Button } from "@nextui-org/react";

export default async function Subscription() {
  const { result: clientSecret, error } = await createPaymentIntent();

  if (!clientSecret) {
    console.error(error);
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-danger">Could not create payment intent</p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col lg:grid grid-cols-2 gap-6">
      <div className="border bg-light rounded-md p-12"></div>
      <div className="px-12">
        <Form clientSecret={clientSecret} />
      </div>
    </div>
  );
}
