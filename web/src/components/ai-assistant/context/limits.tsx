"use client";

import { Section } from "@/components/ui/block";
import Option from "./option";
import { cn, Skeleton } from "@nextui-org/react";
import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";
import Empty from "@/components/ui/empty";
import { useLimits } from "@/lib/general/queries";
import NumberFormat from "@/utils/formatters/currency";
import { Dict } from "@/const/dict";

export default function LimitsContext({
  dict,
  timezone,
}: {
  dict: Dict["private"]["ai-assistant"]["context"]["form"]["limits"] & {
    _error: string;
    periodValues: Dict["private"]["operations"]["expenses"]["limits"]["modal"]["form"]["period"]["values"];
  };
  timezone: string;
}) {
  const { currency } = useAIAssistant();
  const { data: limits, isLoading, error } = useLimits(timezone, currency);

  return (
    <Section title={dict.title}>
      {error ? (
        <div className="pt-6 pb-4">
          <p className="text-danger text-sm text-center">{dict._error}</p>
        </div>
      ) : (
        <div
          className={cn(
            "grid transition-all",
            currency ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col sm:grid grid-cols-3 gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-[62px] rounded-md" />
                  <Skeleton className="h-[62px] rounded-md" />
                  <Skeleton className="h-[62px] rounded-md" />
                </>
              ) : limits && limits.length > 0 ? (
                <>
                  <LimitRef
                    title={dict.periodValues.daily}
                    period="daily"
                    timezone={timezone}
                  />
                  <LimitRef
                    title={dict.periodValues.weekly}
                    period="weekly"
                    timezone={timezone}
                  />
                  <LimitRef
                    title={dict.periodValues.monthly}
                    period="monthly"
                    timezone={timezone}
                  />
                </>
              ) : (
                <Empty
                  title={dict._empty}
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
  title,
  period,
  timezone,
}: {
  title: string;
  period: Limit["period"];
  timezone: string;
}) => {
  const { limit: selectedLimit, setLimit, currency } = useAIAssistant();
  const { data: limits } = useLimits(timezone, currency);
  const limit = currency
    ? limits?.find((limit) => limit.period === period)
    : null;

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
      <h4 className="font-bold text-sm select-none">{title}</h4>
    </Option>
  );
};
