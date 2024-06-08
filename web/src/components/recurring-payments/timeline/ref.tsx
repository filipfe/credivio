import numberFormat from "@/utils/formatters/currency";

export default function PaymentRef({
  title,
  next_payment_date,
  currency,
  amount,
  type,
}: RecurringPayment) {
  return (
    <div className="flex justify-end items-stretch gap-8 hover:bg-primary/5 rounded-md relative h-max group">
      <div className="flex-1 ml-6 my-3 flex items-center justify-between gap-6">
        <div>
          <small className="text-font/75 font-medium">
            {new Date(next_payment_date).toLocaleDateString()}
          </small>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <div className="rounded-md bg-secondary/20 h-10 flex-1 max-w-24"></div>
      </div>
      <div className="h-[126px] py-2 w-0.5 bg-primary flex flex-col items-center justify-center relative">
        <div className="bg-primary rounded-full w-2 min-w-2 h-2" />
        <div className="hidden group-first:block group-last:block absolute group-first:bottom-full group-last:top-full left-0 right-0 h-6 bg-primary"></div>
      </div>
      <div className="flex items-center rounded mr-2 my-2">
        <div className="bg-primary rounded-lg">
          <div className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.4)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
            <span className="text-white text-sm font-medium">{title}</span>
            <div className="h-10">
              <strong className="text-3xl font-bold text-white">
                {type === "income" ? "+" : type === "expense" ? "-" : ""}
                {numberFormat(currency, amount)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
