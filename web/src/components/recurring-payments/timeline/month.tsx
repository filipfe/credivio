import PaymentRef from "./ref";

export default function Month({
  month,
  year,
  payments,
}: Month & { year: number }) {
  const monthDate = new Date();
  monthDate.setMonth(month - 1);

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
        {/* <small className="text-white text-right">
          Łącznie:{" "}
          <span className="font-medium">
            {Object.entries(total_amounts)
              .map(([currency, totalAmount]) =>
                numberFormat(currency, totalAmount)
              )
              .join(", ")}
          </span>
        </small> */}
      </div>
      <div className="py-4 flex flex-col justify-between">
        {payments.map((payment) => (
          <PaymentRef {...payment} key={payment.id} />
        ))}
      </div>
    </div>
  );
}
