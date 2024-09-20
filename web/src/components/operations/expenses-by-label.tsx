"use client";

import { useExpensesByLabel } from "@/lib/operations/queries";
import { useState } from "react";
import Block from "../ui/block";
import numberFormat from "@/utils/formatters/currency";
import { cn, Skeleton } from "@nextui-org/react";
import { ArrowUpRight, Coins } from "lucide-react";
import Link from "next/link";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Empty from "../ui/empty";

type Props = {
  preferences: Preferences;
  className?: string;
};

const colors = ["#177981", "#fdbb2d", "#448dc9", "#fb923c"];

export default function ExpensesByLabel({ preferences, className }: Props) {
  const [currency, setCurrency] = useState<string>(preferences.currency);
  const { isLoading, data: results } = useExpensesByLabel(currency);

  const sum = results
    ? results.reduce((prev, curr) => prev + curr.total_amount, 0)
    : 0;

  return (
    <Block className={cn("gap-6", className)}>
      <div className="flex gap-4 items-start justify-between">
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
        <UniversalSelect
          className="w-20"
          name="currency"
          size="sm"
          radius="md"
          aria-label="Waluta"
          isDisabled={isLoading}
          defaultSelectedKeys={[currency]}
          elements={CURRENCIES}
          onChange={(e) => setCurrency(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <h4 className="text-sm text-font/60">Wydatki według etykiet</h4>
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
          {isLoading || !results || results.length === 0 ? (
            <div className="flex-1 border bg-light"></div>
          ) : (
            results.map(({ total_amount }, k) => (
              <div
                style={{
                  flexGrow: total_amount / sum,
                  backgroundColor: colors[k],
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
          {results.map((label, k) => (
            <Link href={`/expenses?currency=${currency}&label=${label.name}`}>
              <div className="rounded-md border px-4 py-3 flex flex-col gap-1 relative">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: colors[k] }}
                    className="h-2.5 w-2.5 rounded-full"
                  ></div>
                  <h5 className="text-sm text-font/75">{label.name}</h5>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold">
                    {label.total_amount >= sum
                      ? "100"
                      : ((label.total_amount / sum) * 100).toFixed(1)}
                    %
                  </span>
                  <span>-</span>
                  <span className="text-sm">
                    {numberFormat(currency, label.total_amount)}
                  </span>
                </div>
                <ArrowUpRight
                  className="absolute right-4 top-3 text-neutral-400"
                  size={16}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty title="Nie znaleziono wydatków" icon={Coins} />
      )}
    </Block>
  );
}
