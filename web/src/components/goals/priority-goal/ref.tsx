"use client";

import { useSettings } from "@/lib/general/queries";
import NumberFormat from "@/utils/formatters/currency";

export const PaymentRef = ({
  date,
  amount,
  currency,
}: PriorityGoalPayment & { currency: string }) => {
  const { data: settings } = useSettings();
  return (
    <li className="py-2 first:pt-0 border-b last:border-b-0 flex items-center justify-between gap-2">
      <span className="text-sm text-font/80">
        {new Intl.DateTimeFormat(settings?.language, {
          dateStyle: "full",
        }).format(new Date(date))}
      </span>
      <span className="text-sm text-font/80">
        <NumberFormat currency={currency} amount={amount} />
      </span>
    </li>
  );
};
