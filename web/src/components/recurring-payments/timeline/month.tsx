import PaymentRef from "./ref";
import numberFormat from "@/utils/formatters/currency";

type Props = {
  month: string;
  payments: RecurringPayment[];
};

export default function Month({ month, payments }: Props) {
  const total = payments.reduce<Record<string, number>>(
    (prev, { currency, amount }) => ({
      ...prev,
      [currency]: (prev[currency] || 0) + amount,
    }),
    {}
  );

  return (
    <div className="relative">
      <div className="bg-primary/90 flex items-center justify-between py-2 px-4 rounded-md">
        <div className="flex gap-2 items-end">
          <h2 className="font-medium text-white">{month}</h2>
          <small className="text-white/80">2024</small>
        </div>
        <small className="text-white">
          Łącznie:{" "}
          <span className="font-medium">
            {Object.entries(total)
              .map(([currency, amount]) => numberFormat(currency, amount))
              .join(", ")}
          </span>
        </small>
      </div>
      <div className="py-6 flex flex-col justify-between">
        {payments.map((payment) => (
          <PaymentRef {...payment} key={payment.id} />
        ))}
      </div>
    </div>
  );
}
