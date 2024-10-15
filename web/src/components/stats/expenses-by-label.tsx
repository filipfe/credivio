"use client";

import { useContext } from "react";
import Block from "../ui/block";
import { Skeleton } from "@nextui-org/react";
import { ArrowUpRight, Coins } from "lucide-react";
import Link from "next/link";
import Empty from "../ui/empty";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import { useExpensesByLabel } from "@/lib/stats/queries";
import NumberFormat from "@/utils/formatters/currency";
import { Dict } from "@/const/dict";

const colors = ["#177981", "#fdbb2d", "#448dc9", "#fb923c", "#8b5cf6"];

export default function ExpensesByLabel({
  dict,
}: {
  dict: Dict["private"]["stats"]["expenses-by-label"];
}) {
  const { month, year, currency } = useContext(StatsFilterContext);
  const { isLoading, data: results } = useExpensesByLabel(
    currency,
    month + 1,
    year
  );

  const sum = results
    ? results.reduce((prev, curr) => prev + curr.total_amount, 0)
    : 0;

  const today = new Date();

  return (
    <Block className="gap-6 col-span-2">
      {isLoading ? (
        <>
          <div className="grid gap-1">
            <Skeleton className="w-28 h-5 rounded-full" />
            <Skeleton className="w-40 h-9 rounded-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="w-36 h-5 rounded-full" />
            <Skeleton className="h-2 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-md" />
            ))}
          </div>
        </>
      ) : results && results.length ? (
        <>
          <div className="grid gap-1">
            <h2 className="text-font/75 text-sm">{dict.title}</h2>
            <strong className="text-3xl">
              <NumberFormat currency={currency} amount={sum} />
            </strong>
          </div>
          <div className="grid gap-2">
            <h4 className="text-sm text-font/60">{dict.description}</h4>
            <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
              {isLoading || !results || results.length === 0 ? (
                <div className="flex-1 border bg-light"></div>
              ) : (
                results.map(({ name, total_amount }, k) => (
                  <div
                    key={k}
                    style={{
                      flexGrow: total_amount / sum,
                      backgroundColor: name ? colors[k] : "#d1d5db",
                    }}
                  ></div>
                ))
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {results.map((label, k) => {
              const totalPercentage =
                label.total_amount >= sum
                  ? "100"
                  : ((label.total_amount / sum) * 100).toFixed(1);

              const labelBackgroundColor = label.name ? colors[k] : "#d1d5db";

              const labelContent = (
                <div className="rounded-md border px-4 py-3 flex flex-col gap-1 relative">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: labelBackgroundColor }}
                      className="h-2.5 w-2.5 rounded-full"
                    ></div>
                    <h5 className="text-sm text-font/75">
                      {label.name || dict.other}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">
                      {totalPercentage}%
                    </span>
                    <span>-</span>
                    <span className="text-sm">
                      <NumberFormat
                        amount={label.total_amount}
                        currency={currency}
                      />
                    </span>
                  </div>
                  {label.name && (
                    <ArrowUpRight
                      className="absolute right-4 top-3 text-neutral-400"
                      size={16}
                    />
                  )}
                </div>
              );

              return label.name ? (
                <Link
                  key={k}
                  href={`/expenses?currency=${currency}&label=${
                    label.name
                  }&from=${year}-${String(month + 1).padStart(2, "0")}-01&to=${
                    year === today.getFullYear() && month === today.getMonth()
                      ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                          today.getDate()
                        ).padStart(2, "0")}`
                      : `${year}-${String(month + 1).padStart(2, "0")}-${String(
                          new Date(year, month + 1, 0).getDate()
                        ).padStart(2, "0")}`
                  }`}
                >
                  {labelContent}
                </Link>
              ) : (
                labelContent
              );
            })}
          </div>
        </>
      ) : (
        <Empty title={dict._empty} icon={Coins} />
      )}
    </Block>
  );
}
