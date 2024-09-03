"use client";

import Block from "@/components/ui/block";
import LineChart from "@/components/ui/charts/line-chart";
import LineChartLoader from "@/components/ui/charts/line-loader";
import Empty from "@/components/ui/empty";
import { useBalanceHistory } from "@/lib/operations/queries";
import { useState } from "react";
import MonthInput from "../ui/inputs/month";
import YearInput from "../ui/inputs/year";
import getDisabledMonths from "@/utils/operations/get-disabled-months";

const now = new Date();

export default function BalanceByMonth() {
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const { data: results, isLoading } = useBalanceHistory({
    month: month + 1,
    year,
  });
  return (
    <Block
      className="xl:col-span-3 flex-1"
      title="Bilans"
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
    >
      {isLoading ? (
        <LineChartLoader className="!p-0" hideTitle />
      ) : results && results.length > 0 ? (
        <LineChart data={results} type="balance" />
      ) : (
        <Empty
          title="Brak danych do wyświetlenia!"
          cta={{ title: "Dodaj wydatek", href: "/expenses/add" }}
        />
      )}
    </Block>
  );
}
