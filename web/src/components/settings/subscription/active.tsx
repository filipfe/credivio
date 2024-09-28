import { Button } from "@nextui-org/react";
import { Check } from "lucide-react";
import Stripe from "stripe";

interface Props extends Stripe.Subscription {}

export default function Active({ status }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 bg-primary rounded-full grid place-content-center">
        <Check size={32} color="white" />
      </div>
      {status === "active" ? "Subskrypcja aktywna" : "Okres próbny aktywny"}
      <Button>Dezaktywuj</Button>
    </div>
  );
}
