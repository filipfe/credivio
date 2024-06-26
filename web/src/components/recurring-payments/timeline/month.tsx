import PaymentRef from "./ref";
import numberFormat from "@/utils/formatters/currency";

export default function Month({
  month,
  year,
  payments,
  total_amounts,
}: Month & { year: number }) {
  const monthDate = new Date();
  monthDate.setMonth(month);

  return (
    <div className="relative">
      <div className="bg-primary flex items-center justify-between py-2 px-4 rounded-md sticky top-0 z-10">
        <div className="flex gap-2 items-end">
          <h2 className="font-medium text-white">
            {new Intl.DateTimeFormat("pl-PL", { month: "long" }).format(
              monthDate
            )}
          </h2>
          <small className="text-white/80">{year}</small>
        </div>
        <small className="text-white">
          Łącznie:{" "}
          <span className="font-medium">
            {Object.entries(total_amounts)
              .map(([currency, totalAmount]) =>
                numberFormat(currency, totalAmount)
              )
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
