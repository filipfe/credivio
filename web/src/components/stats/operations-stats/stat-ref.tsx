"use client";

import { StatsFilterContext } from "@/app/(private)/stats/providers";
import Block from "@/components/ui/block";
import NumberFormat from "@/utils/formatters/currency";
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
    <Block className="col-span-1 row-start-2 row-end-3 !p-0 self-start overflow-hidden w-full">
      <div className="flex items-start justify-between px-6 sm:px-10 pt-4 sm:pt-8">
        <div className="grid gap-1">
          <h2 className="text-font/75 text-sm">
            {type === "incomes" ? "Przychody" : "Wydatki"}
          </h2>
          <strong className="text-3xl">
            <NumberFormat currency={currency} amount={amount} />
          </strong>
        </div>
        <button className="h-7 w-7 rounded-md border bg-light grid place-content-center">
          <Link
            href={`/${type}?currency=${currency}&from=${year}-${(month + 1)
              .toString()
              .padStart(2, "0")}-01&to=${
              year === today.getFullYear() && month === today.getMonth()
                ? `${year}-${(month + 1).toString().padStart(2, "0")}-${String(
                    today.getDate()
                  ).padStart(2, "0")}`
                : `${year}-${(month + 1).toString().padStart(2, "0")}-${String(
                    new Date(year, month + 1, 0).getDate()
                  ).padStart(2, "0")}`
            }`}
          >
            <ArrowUpRight className="text-neutral-400" size={16} />
          </Link>
        </button>
      </div>
      <div className="flex-1 grid">
        <ResponsiveContainer width="100%" height={82}>
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
                <stop offset="5%" stopColor="#177981" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#177981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fdbb2d" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#fdbb2d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis
              hide
              domain={maxValue > 0 ? [-(maxValue / 2), "dataMax"] : [-100, 200]}
            />
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey="total"
              baseValue={maxValue > 0 ? -(maxValue / 2) : -100}
              stroke={type === "incomes" ? "#177981" : "#fdbb2d"}
              fill={`url(#${type})`}
              strokeWidth={2}
              // fill={type === "incomes" ? "#177981" : "#fdbb2d"}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Block>
  );
}

export function StatLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white border rounded-lg py-6 sm:py-8 px-6 sm:px-10 space-y-4",
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
