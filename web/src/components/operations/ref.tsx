import numberFormat from "@/utils/formatters/currency";
import { Skeleton, cn } from "@nextui-org/react";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";

export default function OperationRef({
  title,
  issued_at,
  type,
  currency,
  amount,
}: Payment) {
  const isIncome = type === "income";
  return (
    <div className="rounded-md bg-primary">
      <div className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.4)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-md backdrop-blur-lg flex flex-col gap-2 min-w-64">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">{title}</span>
          <small className="text-white/80">
            {formatDistance(issued_at, new Date(), {
              addSuffix: true,
              locale: pl,
            })}
          </small>
        </div>
        <div className="h-10">
          <strong className="text-3xl font-bold text-white">
            {type === "income" ? "+" : type === "expense" ? "-" : ""}
            {numberFormat(currency, amount)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export function OperationLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-light rounded-lg py-4 px-6 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="px-1 py-0.5 h-9 w-48 rounded-full" />
    </div>
  );
}
