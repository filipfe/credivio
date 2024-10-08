"use client";

import { useContext } from "react";
import Block from "../ui/block";
import numberFormat from "@/utils/formatters/currency";
import { Skeleton } from "@nextui-org/react";
import { ArrowUpRight, Coins } from "lucide-react";
import Link from "next/link";
import Empty from "../ui/empty";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import { useExpensesByLabel } from "@/lib/stats/queries";

const colors = ["#177981", "#fdbb2d", "#448dc9", "#fb923c", "#8b5cf6"];

export default function ExpensesByLabel() {
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
    <Block className="gap-6 xl:col-span-3 max-h-[479px] h-[479px]">
      <div>
        {isLoading ? (
          <div className="grid gap-3 flex-1">
            <Skeleton className="w-1/6 max-w-xs h-4 rounded-full" />
            <Skeleton className="w-1/4 max-w-xs h-8 rounded-full" />
          </div>
        ) : (
          <div className="grid gap-1">
            <h2 className="text-font/75 text-sm">Wydatki łącznie</h2>
            <strong className="text-3xl">{numberFormat(currency, sum)}</strong>
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <h4 className="text-sm text-font/60">Wydatki według etykiet</h4>
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
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
        </div>
      ) : results && results.length ? (
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
                    {label.name || "Inne"}
                  </h5>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold">{totalPercentage}%</span>
                  <span>-</span>
                  <span className="text-sm">
                    {numberFormat(currency, label.total_amount)}
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
      ) : (
        <Empty title="Nie znaleziono wydatków" icon={Coins} />
      )}
    </Block>
  );
}
