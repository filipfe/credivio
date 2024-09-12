import numberFormat from "@/utils/formatters/currency";
import { Skeleton, cn } from "@nextui-org/react";
import { ArrowDownIcon, ArrowUpIcon, Minus } from "lucide-react";

type Props = {
  title: string;
  description: string;
  currency: string;
  amount?: number;
  stat?: Stat;
  cta?: React.ReactNode;
};

export default function StatBox({
  title,
  description,
  currency,
  amount,
  cta,
  stat,
}: Props) {
  return (
    <div className="xl:col-span-2 bg-white border rounded-md py-6 sm:py-8 px-6 sm:px-10 space-y-4">
      <div className="flex items-center gap-4 justify-between">
        <h3 className="sm:text-lg">{title}</h3>
        {cta}
      </div>
      <div className="flex items-center gap-2">
        <h4 className="text-3xl">
          {numberFormat(currency, stat ? stat.amount : amount!)}
        </h4>
        {stat &&
          (stat.difference_indicator === "no_change" ? (
            <div className="bg-default text-default-dark flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
              <Minus size={16} />
            </div>
          ) : stat.difference_indicator === "positive" ? (
            <div className="bg-success-light text-success flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
              <ArrowUpIcon size={16} />
              {stat.difference}%
            </div>
          ) : (
            <div className="bg-danger-light text-danger flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
              <ArrowDownIcon size={16} />
              {stat.difference}%
            </div>
          ))}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}

export function StatLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg py-6 sm:py-8 px-6 sm:px-10 space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-4 justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-48 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}
