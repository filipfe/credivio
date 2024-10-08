"use client";

import { StatsFilterContext } from "@/app/(private)/stats/providers";
import numberFormat from "@/utils/formatters/currency";
import { Skeleton, cn } from "@nextui-org/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

type Props = {
  data: { total: number }[];
  type: "incomes" | "expenses";
  amount: number;
};

export default function StatBox({ data, type, amount }: Props) {
  const { currency, month, year } = useContext(StatsFilterContext);
  const maxValue = Math.max(...data.map((item) => item.total));

  const today = new Date();

  return (
    <div className="xl:col-span-1 bg-white border rounded-md py-6 sm:py-8 px-6 sm:px-10 space-y-2 relative">
      <div className="grid gap-1">
        <h3 className="text-font/75">
          {type === "incomes" ? "Przychody" : "Wydatki"}
        </h3>
        <strong className="text-3xl">{numberFormat(currency, amount)}</strong>
      </div>
      <ResponsiveContainer width="100%" height="100%" maxHeight={80}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="incomes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#177981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#177981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fdbb2d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fdbb2d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis
            hide
            domain={maxValue > 0 ? [-(maxValue / 2), "dataMax"] : [-100, 200]}
          />
          <Area
            type="monotone"
            dataKey="total"
            baseValue={maxValue > 0 ? -(maxValue / 2) : -100}
            stroke={type === "incomes" ? "#177981" : "#fdbb2d"}
            fill={`url(#${type})`}
            // fill={type === "incomes" ? "#177981" : "#fdbb2d"}
          />
        </AreaChart>
      </ResponsiveContainer>
      <Link
        href={`/${type}?currency=${currency}&from=${year}-${String(
          month + 1
        ).padStart(2, "0")}-01&to=${
          year === today.getFullYear() && month === today.getMonth()
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                today.getDate()
              ).padStart(2, "0")}`
            : `${year}-${String(month + 1).padStart(2, "0")}-${String(
                new Date(year, month + 1, 0).getDate()
              ).padStart(2, "0")}`
        }`}
      >
        <ArrowUpRight
          className="absolute right-8 top-6 text-neutral-400"
          size={16}
        />
      </Link>
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
