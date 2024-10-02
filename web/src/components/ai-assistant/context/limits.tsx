"use client";

import { Section } from "@/components/ui/block";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Option from "./option";
import { useLimits } from "@/lib/operations/queries";
import { CURRENCIES } from "@/const";
import { cn, Skeleton } from "@nextui-org/react";
import numberFormat from "@/utils/formatters/currency";

export default function LimitsContext() {
  const [currency, setCurrency] = useState<string>();
  const { data: limits, isLoading, error } = useLimits(currency);
  const [selected, setSelected] = useState<Limit["period"]>();

  console.log(limits);

  useEffect(() => {
    setSelected(undefined);
  }, [currency]);

  return (
    <Section title="Limity wydatków">
      <div className="flex items-center gap-3 col-span-full">
        {CURRENCIES.map((curr) => (
          <Option
            className="text-sm font-medium py-2"
            // highlight="outline"
            id={`context-limit-${curr}`}
            isActive={currency === curr}
            onActiveChange={(checked) =>
              setCurrency(checked ? curr : undefined)
            }
            key={curr}
          >
            {curr}
          </Option>
        ))}
      </div>

      {error ? (
        <div className="pt-6 pb-4">
          <p className="text-danger text-sm text-center">Wystąpił błąd</p>
        </div>
      ) : (
        <div
          className={cn(
            "grid transition-all",
            currency ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-3 gap-3 pt-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-[62px] rounded-md" />
                  <Skeleton className="h-[62px] rounded-md" />
                  <Skeleton className="h-[62px] rounded-md" />
                </>
              ) : (
                <>
                  <LimitRef
                    period="daily"
                    currency={currency}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <LimitRef
                    period="weekly"
                    currency={currency}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <LimitRef
                    period="monthly"
                    currency={currency}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

const LimitRef = ({
  period,
  currency,
  selected,
  setSelected,
}: {
  period: Limit["period"];
  currency?: string;
  selected: Limit["period"] | undefined;
  setSelected: Dispatch<SetStateAction<Limit["period"] | undefined>>;
}) => {
  const { data: limits } = useLimits(currency);
  const limit = currency
    ? limits?.find((limit) => limit.period === period)
    : null;
  if (!limit) return <></>;
  return (
    <Option
      id={`context-limit-${period}`}
      isActive={selected === period}
      onActiveChange={(checked) => setSelected(checked ? period : undefined)}
    >
      <h5 className="text-xs font-medium opacity-80 select-none">
        {numberFormat(currency!, limit.total)} /{" "}
        {numberFormat(currency!, limit.amount)}
      </h5>
      <h4 className="font-bold text-sm select-none">
        {period === "daily"
          ? "Dzienny"
          : period === "weekly"
          ? "Tygodniowy"
          : "Miesięczny"}
      </h4>
    </Option>
  );
};
