"use client";

import { Section } from "@/components/ui/block";
import { useState } from "react";
import Option from "./option";
import { CURRENCIES } from "@/const";
import { cn, Skeleton } from "@nextui-org/react";
import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";
import Empty from "@/components/ui/empty";
import { useLimits, useSettings } from "@/lib/general/queries";
import NumberFormat from "@/utils/formatters/currency";

export default function LimitsContext({ timezone }: { timezone: string }) {
  const { setLimit } = useAIAssistant();
  const [currency, setCurrency] = useState<string>();
  const { data: limits, isLoading, error } = useLimits(timezone, currency);

  return (
    <Section title="Limity wydatków">
      <div className="flex flex-wrap items-center gap-3 col-span-full">
        {CURRENCIES.map((curr) => (
          <Option
            className="text-sm font-medium py-2"
            // highlight="outline"
            id={`context-limit-${curr}`}
            isActive={currency === curr}
            onActiveChange={(checked) => {
              setLimit(undefined);
              setCurrency(checked ? curr : undefined);
            }}
            key={`limits-${curr}`}
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
            <div className="flex flex-col sm:grid grid-cols-3 gap-3 pt-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-[62px] rounded-md" />
                  <Skeleton className="h-[62px] rounded-md" />
                  <Skeleton className="h-[62px] rounded-md" />
                </>
              ) : limits && limits.length > 0 ? (
                <>
                  <LimitRef
                    period="daily"
                    currency={currency}
                    timezone={timezone}
                  />
                  <LimitRef
                    period="weekly"
                    currency={currency}
                    timezone={timezone}
                  />
                  <LimitRef
                    period="monthly"
                    currency={currency}
                    timezone={timezone}
                  />
                </>
              ) : (
                <Empty
                  title="Brak limitów dla podanej waluty"
                  className="pt-4 pb-2 col-span-full"
                />
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
  timezone,
}: {
  period: Limit["period"];
  currency?: string;
  timezone: string;
}) => {
  const { limit: selectedLimit, setLimit } = useAIAssistant();
  const { data: limits } = useLimits(timezone, currency);
  const limit = currency
    ? limits?.find((limit) => limit.period === period)
    : null;
  console.log({ limits });

  if (!limit) return <></>;

  const isActive = selectedLimit
    ? selectedLimit.period === limit.period &&
      selectedLimit.currency === limit.currency
    : false;
  return (
    <Option
      id={`context-limit-${period}`}
      isActive={isActive}
      onActiveChange={(checked) => setLimit(checked ? limit : undefined)}
    >
      <h5 className="text-xs font-medium opacity-80 select-none">
        <NumberFormat currency={currency!} amount={limit.total} /> /{" "}
        <NumberFormat currency={currency!} amount={limit.amount} />
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
