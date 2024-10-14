import IssuedAt from "./issued-at";
import NumberFormat from "@/utils/formatters/currency";

export default function PaymentRef({
  title,
  issued_at,
  currency,
  amount,
  type,
}: Payment) {
  return (
    <div className="flex justify-end items-stretch md:gap-8 even:bg-light rounded-md relative h-max group">
      <div className="flex-1 ml-4 my-3 flex items-center">
        <div>
          <IssuedAt issued_at={issued_at} />
          <h3 className="font-medium">{title}</h3>
        </div>
      </div>
      <div className="flex items-center mr-3">
        <strong className="text-xl sm:text-2xl md:text-3xl font-bold text-primary lg:hidden">
          {type === "income" ? "+" : type === "expense" ? "-" : ""}
          <NumberFormat currency={currency} amount={amount} />
        </strong>
      </div>
      <div className="h-[126px] py-2 w-0.5 bg-primary flex flex-col items-center justify-center relative mr-4 lg:mr-0">
        <div className="bg-primary rounded-full w-2 min-w-2 h-2" />
        <div className="hidden group-first:block group-last:block absolute group-first:bottom-full group-last:top-full left-0 right-0 h-6 bg-primary"></div>
      </div>
      <div className="items-center rounded mr-2 my-2 hidden lg:flex">
        <div className="bg-primary rounded-lg">
          <div className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.4)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col gap-2 min-w-64">
            <span className="text-white text-sm font-medium">{title}</span>
            <div className="h-10">
              <strong className="text-3xl font-bold text-white">
                {type === "income" ? "+" : type === "expense" ? "-" : ""}
                <NumberFormat currency={currency} amount={amount} />
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
