"use client";

import Block from "@/components/ui/block";
import numberFormat from "@/utils/formatters/currency";
import { CircularProgress, cn, Skeleton } from "@nextui-org/react";

const getPeriodTitle = (period: "daily" | "weekly" | "monthly") => {
  switch (period) {
    case "daily":
      return "Dzień";
    case "monthly":
      return "Miesiąc";
    case "weekly":
      return "Tydzień";
  }
};

interface Props extends Pick<Limit, "period"> {
  currency: string;
  limit?: Limit;
}

export default function LimitRef({ period, currency, limit }: Props) {
  const percentage = limit ? (limit.total / limit.amount) * 100 : 0;

  return (
    <Block
      className={cn(
        "sm:px-6 sm:py-6 relative",
        !limit && "min-h-32 2xl:min-h-[114px]"
      )}
    >
      <div
        className={cn(
          "flex justify-between gap-3",
          !limit ? "items-start" : "items-center"
        )}
      >
        {limit ? (
          <div className="flex items-center gap-3">
            <CircularProgress
              size="lg"
              value={percentage}
              showValueLabel
              classNames={{
                svg: "w-16 h-16",
                value: cn("font-bold text-[80%]"),
              }}
            />
            <div className="grid">
              <span className="text-sm text-font/60">
                {getPeriodTitle(period)}
              </span>
              <span className="text-sm font-medium">
                {numberFormat(currency, limit.total)} /{" "}
                {numberFormat(currency, limit.amount)}
              </span>
            </div>
          </div>
        ) : (
          <h4 className="text-sm">Limit - {getPeriodTitle(period)}</h4>
        )}
      </div>
    </Block>
  );
}
