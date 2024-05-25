"use client";

const numberFormat = (currency: string, amount: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  }).format(amount);

export default function RecurringPaymentRef(props: RecurringPayment) {
  const payment = props;

  return (
    <div className="bg-white rounded-lg py-4 px-6 flex flex-col justify-between relative opacity-100 min-w-60">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg line-clamp-1">{payment.title}</h3>
          <small className="text-neutral-500">
            {new Date(payment.next_payment_date).toLocaleDateString()}
          </small>
        </div>
        <div
          className={`${
            payment.type === "income"
              ? "bg-success-light text-success"
              : "bg-danger-light text-danger"
          } rounded-full px-1 py-0.5 text-2xl font-bold text-center`}
        >
          {(payment.type === "income" ? "+" : "-") +
            numberFormat(payment.currency, payment.amount)}
        </div>
      </div>
    </div>
  );
}
