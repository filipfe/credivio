import numberFormat from "@/utils/formatters/currency";
import { Skeleton, cn } from "@nextui-org/react";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Coins, Wallet2 } from "lucide-react";

type Props = {
  payment: Payment;
};

export default function OperationRef({
  payment: { title, issued_at, type, currency, amount },
}: Props) {
  return (
    <div className="rounded-md bg-primary max-w-max">
      <div className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.4)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-md backdrop-blur-lg flex flex-col gap-2 min-w-64">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            {type === "income" ? <Wallet2 size={14} /> : <Coins size={14} />}
            <h4 className="text-white text-sm font-medium line-clamp-1 max-w-32 break-keep">
              {title}
            </h4>
          </div>
          <small className="text-white/80">
            {formatDistance(issued_at, new Date(), {
              addSuffix: true,
              locale: pl,
              includeSeconds: false,
            })}
          </small>
        </div>
        <div className="h-10">
          <strong className="text-3xl font-bold text-white">
            {type === "income" ? "+" : type === "expense" ? "-" : ""}
            {numberFormat(currency, amount, "compact")}
          </strong>
        </div>
      </div>
    </div>
    // <div className="rounded-md bg-white max-w-max">
    //   <div
    //     className={cn(
    //       "border p-4 rounded-md flex flex-col gap-2 min-w-64",
    //       type === "income"
    //         ? "border-primary/25 shadow-[inset_0px_2px_9px_rgba(23,121,129,0.25)] bg-primary/5"
    //         : "border-danger/25 shadow-[inset_0px_2px_9px_rgba(179,57,57,0.25)] bg-danger/5"
    //     )}
    //   >
    //     <div className="flex items-center justify-between gap-4">
    //       <h4
    //         className={cn(
    //           "text-sm font-medium line-clamp-1 max-w-32 break-keep",
    //           type === "income" ? "text-primary" : "text-danger"
    //         )}
    //       >
    //         {title}
    //       </h4>
    //       <small
    //         className={cn(
    //           type === "income" ? "text-primary/80" : "text-danger/80"
    //         )}
    //       >
    //         {formatDistance(issued_at, new Date(), {
    //           addSuffix: true,
    //           locale: pl,
    //           includeSeconds: false,
    //         })}
    //       </small>
    //     </div>
    //     <div className="h-10">
    //       <strong
    //         className={cn(
    //           "text-3xl font-bold",
    //           type === "income" ? "text-primary" : "text-danger"
    //         )}
    //       >
    //         {type === "income" ? "+" : type === "expense" ? "-" : ""}
    //         {numberFormat(currency, amount)}
    //       </strong>
    //     </div>
    //   </div>
    // </div>
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
