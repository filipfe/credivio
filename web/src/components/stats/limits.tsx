"use client";

import { useContext } from "react";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import LimitRef from "./limit-ref";
import { useLimits } from "@/lib/general/queries";

export default function Limits() {
  const { month, year, currency } = useContext(StatsFilterContext);
  const { data: limits, isLoading } = useLimits(currency);

  return (
    <div className="flex flex-col 2xl:grid grid-cols-3 gap-4 sm:gap-6 justify-center col-span-full">
      {/* <LimitRef
        period="daily"
        currency={currency}
        limit={limits?.find((limit) => limit.period === "daily")}
      />
      <LimitRef
        period="weekly"
        currency={currency}
        limit={limits?.find((limit) => limit.period === "weekly")}
      /> */}
      <LimitRef
        period="monthly"
        currency={currency}
        limit={limits?.find((limit) => limit.period === "monthly")}
      />
    </div>
  );
}
