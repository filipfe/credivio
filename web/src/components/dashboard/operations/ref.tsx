import numberFormat from "@/utils/formatters/currency";
import { Skeleton, cn } from "@nextui-org/react";

export default function Operation({
  operation,
}: {
  operation: LatestOperation;
}) {
  return (
    <div className="bg-white rounded-lg py-4 px-6 flex flex-col gap-3 min-w-60">
      <div className="flex items-center justify-between">
        <h3 className="text-lg line-clamp-1">{operation.title}</h3>
        <small className="text-neutral-500">
          {new Date(operation.issued_at).toLocaleDateString()}
        </small>
      </div>
      <div
        className={`${
          operation.type === "income"
            ? "bg-success-light text-success"
            : "bg-danger-light text-danger"
        } rounded-full px-1 py-0.5 text-2xl font-bold text-center`}
      >
        {(operation.type === "income" ? "+" : "-") +
          numberFormat(operation.currency, operation.amount)}
      </div>
    </div>
  );
}

export function OperationLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg py-4 px-6 flex flex-col gap-3",
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
