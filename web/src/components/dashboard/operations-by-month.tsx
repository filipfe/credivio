"use client";

import { PeriodContext } from "@/app/(private)/(operations)/providers";
import Block from "@/components/ui/block";
import LineChart from "@/components/ui/charts/line-chart";
import LineChartLoader from "@/components/ui/charts/line-loader";
import Empty from "@/components/ui/empty";
import {
  useBalanceHistory,
  useOperationsAmountsHistory,
} from "@/lib/operations/queries";
import { useContext, useState } from "react";
import MonthInput from "../ui/inputs/month";
import YearInput from "../ui/inputs/year";

const getTitle = (type: "balance" | "income" | "expense") => {
  switch (type) {
    case "balance":
      return "Bilans";
    case "income":
      return "Przychody";
    case "expense":
      return "Wydatki";
  }
};

type Props = {
  type: "balance" | "income" | "expense";
  withPeriod?: boolean;
};

const now = new Date();

const getDisabledMonths = (curr: number): string[] => {
  const result: string[] = [];
  for (let i = curr + 1; i <= 11; i++) {
    result.push(i.toString());
  }
  return result;
};

export default function OperationsByMonth({ type, withPeriod }: Props) {
  const periodContext = useContext(PeriodContext);
  const [currency, setCurrency] = useState<string | null>(null);
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const { data: results, isLoading } =
    type === "balance"
      ? useBalanceHistory({ month: month + 1, year })
      : useOperationsAmountsHistory(type, {});
  return (
    <Block
      className="xl:col-span-3 flex-1"
      title={`${getTitle(type)}`}
      cta={
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <MonthInput
            value={month}
            disabledKeys={
              year === now.getFullYear()
                ? getDisabledMonths(now.getMonth())
                : []
            }
            onChange={(value) => setMonth(value)}
          />
          <YearInput value={year} onChange={(value) => setYear(value)} />
        </div>
      }
      // cta={
      //   type === "balance" && (
      //     <UniversalSelect
      //       className="w-20"
      //       size="sm"
      //       name="currency"
      //       aria-label="Waluta"
      //       defaultSelectedKeys={[currency]}
      //       elements={CURRENCIES}
      //       onChange={(e) => setCurrency(e.target.value)}
      //     />
      //   )
      // }
    >
      {isLoading ? (
        <LineChartLoader className="!p-0" hideTitle />
      ) : results && results.length > 0 ? (
        <LineChart
          data={results}
          type={type}
          {...(withPeriod ? periodContext : {})}
        />
      ) : (
        <Empty
          title="Brak danych do wyświetlenia!"
          cta={{ title: "Dodaj przychód", href: "/incomes/add" }}
        />
      )}
    </Block>
  );
}
