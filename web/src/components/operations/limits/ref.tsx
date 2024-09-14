"use client";

import Block from "@/components/ui/block";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { useLimits } from "@/lib/operations/queries";
import numberFormat from "@/utils/formatters/currency";
import { Button, CircularProgress, cn, Skeleton } from "@nextui-org/react";
import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";

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
  defaultCurrency: string;
  onAdd: (currency: string, amount?: string) => void;
}

export default function LimitRef({ period, defaultCurrency, onAdd }: Props) {
  const [currency, setCurrency] = useState(defaultCurrency);
  const { data: limits, isLoading } = useLimits(currency);

  const limit = limits?.find((limit) => limit.period === period);

  const percentage = limit ? (limit.total / limit.amount) * 100 : 0;

  return (
    <Block
      className={cn(
        "sm:px-6 sm:py-6 relative",
        !isLoading && !limit && "min-h-32 2xl:min-h-[114px]"
      )}
    >
      <div
        className={cn(
          "flex justify-between gap-3",
          !isLoading && !limit ? "items-start" : "items-center"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-[58px] h-[58px] border-[6px] border-default-300/50 rounded-full"></div>
            <div className="grid gap-2">
              <Skeleton className="w-24 h-2 rounded-full" />
              <Skeleton className="w-16 h-2 rounded-full" />
            </div>
          </div>
        ) : limit ? (
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
              <span className="text-sm font-medium">
                {numberFormat(currency, limit.total)} /{" "}
                {numberFormat(currency, limit.amount)}
              </span>
              <span className="text-sm text-font/60">
                {getPeriodTitle(period)}
              </span>
            </div>
          </div>
        ) : (
          <h4 className="text-sm">Limit - {getPeriodTitle(period)}</h4>
        )}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {limit && (
            <Button
              variant="flat"
              size="sm"
              radius="md"
              disableRipple
              isIconOnly
              className="border"
              onPress={() => onAdd(currency, limit.amount.toString())}
            >
              <SquarePen size={14} />
            </Button>
          )}
          <UniversalSelect
            className="w-20"
            name="currency"
            size="sm"
            radius="md"
            aria-label="Waluta"
            selectedKeys={[currency]}
            elements={CURRENCIES}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>
      </div>
      {!isLoading && !limit && (
        <div className="grid place-content-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2">
          <Button
            variant="flat"
            radius="md"
            size="sm"
            disableRipple
            startContent={<Plus size={14} />}
            className="bg-light border max-w-max"
            onPress={() => onAdd(currency)}
          >
            Ustaw limit
          </Button>
        </div>
      )}
    </Block>
  );
}
