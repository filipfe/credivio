"use client";

import { DotIcon } from "lucide-react";

const numberFormat = (currency: string, amount: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  }).format(amount);

export default function TimelineItem(props: RecurringPayment) {
  const payment = props;

  return (
    <div className="flex items-center gap-1 hover:bg-primary hover:bg-opacity-5 px-2 py-1 rounded">
      <small className="text-neutral-500 w-[8ch]">
        {new Date(payment.next_payment_date).toLocaleDateString()}
      </small>
      <DotIcon className="text-primary z-10" size={60} />
      <div className="">
        {payment.title}
        <div
          className={`${
            payment.type === "income"
              ? "bg-success-light text-success"
              : "bg-danger-light text-danger"
          } rounded-full px-1 py-0.5 font-bold text-center`}
        >
          {(payment.type === "income" ? "+" : "-") +
            numberFormat(payment.currency, payment.amount)}
        </div>
      </div>
    </div>
  );
}
