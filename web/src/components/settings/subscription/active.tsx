import { getSettings } from "@/lib/general/actions";
import { Button } from "@nextui-org/react";
import { Check } from "lucide-react";

export default async function Active({ status, plan }: Subscription) {
  const settings = await getSettings();

  return (
    <div className="px-10 py-8 border bg-light rounded-md flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 bg-primary rounded-full grid place-content-center">
          <Check size={32} color="white" />
        </div>
        <h3 className="sm:text-lg lg:text-xl">
          {status === "active" ? "Subskrypcja aktywna" : "Okres próbny aktywny"}
        </h3>
        <p className="text-sm">Dziękujemy za korzystanie z Monfuse</p>
      </div>
      <p className="inline-flex items-end">
        <strong className="text-2xl sm:text-3xl lg:text-4xl">
          {new Intl.NumberFormat(settings.language, {
            style: "currency",
            currency: plan.currency,
          }).format(plan.amount / 100)}
        </strong>
        <sub className="text-sm mb-1 ml-2 opacity-80">/ miesiąc</sub>
      </p>
      <Button className="border bg-white" disableRipple>
        Dezaktywuj
      </Button>
    </div>
  );
}
