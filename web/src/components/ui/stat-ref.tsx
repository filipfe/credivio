"use client";

import numberFormat from "@/utils/formatters/currency";
import { Skeleton, cn } from "@nextui-org/react";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpRight, Minus } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  currency: string;
  amount?: number;
  stat?: Stat;
  cta?: React.ReactNode;
};

export default function StatBox({
  title,
  description = "",
  currency,
  amount,
  cta,
  stat,
}: Props) {
  return (
    <div className="xl:col-span-1 bg-white border rounded-md py-6 sm:py-8 px-6 sm:px-10 space-y-2 relative">
      <div className="flex items-center gap-4 justify-between">
        <h3 className="text-font/75">{title}</h3>
        {cta}
      </div>
      <div className="flex items-center gap-2">
        <strong className="text-3xl">
          {numberFormat(currency, stat ? stat.amount : amount!)}
        </strong>
        {stat &&
          (stat.difference_indicator === "no_change" ? (
            <div className="bg-default text-default-dark flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-xs">
              <Minus size={14} />
            </div>
          ) : stat.difference_indicator === "positive" ? (
            <div className="bg-default text-default-dark flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-xs">
              <ArrowUpIcon size={14} />
              {stat.difference}%
            </div>
          ) : (
            <div className="bg-default text-default-dark flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-xs">
              <ArrowDownIcon size={14} />
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
      <Skeleton className="h-7 w-24 rounded-full" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-48 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}
