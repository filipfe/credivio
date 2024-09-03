"use client";

import { PeriodContext } from "@/app/(private)/(operations)/providers";
import Block from "@/components/ui/block";
import LineChart from "@/components/ui/charts/line-chart";
import LineChartLoader from "@/components/ui/charts/line-loader";
import Empty from "@/components/ui/empty";
import { useOperationsAmountsHistory } from "@/lib/operations/queries";
import { useContext, useState } from "react";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import CurrencySelect from "../ui/table/currency-select";

const getTitle = (type: "income" | "expense") => {
  switch (type) {
    case "income":
      return "Przychody";
    case "expense":
      return "Wydatki";
  }
};

type Props = {
  type: "income" | "expense";
};

export default function OperationsByMonth({ type }: Props) {
  const periodContext = useContext(PeriodContext);
  const [currency, setCurrency] = useState<string>();
  const { data: results, isLoading } = useOperationsAmountsHistory(type, {
    currency,
  });
  return (
    <Block
      className="xl:col-span-3 flex-1"
      title={`${getTitle(type)}`}
      cta={
        <div className="flex-1">
          <div className="w-full max-w-32 ml-auto">
            <CurrencySelect
              value={currency || ""}
              onChange={(value) => setCurrency(value || undefined)}
            />
          </div>
        </div>
      }
    >
      {isLoading ? (
        <LineChartLoader className="!p-0" hideTitle />
      ) : results && results.length > 0 ? (
        <LineChart
          data={results}
          currency={currency}
          type={type}
          minHeight={280}
          {...periodContext}
        />
      ) : (
        <Empty
          title="Brak danych do wyświetlenia!"
          cta={{
            title: `Dodaj ${type === "income" ? "przychód" : "wydatek"}`,
            href: `/${type}s/add`,
          }}
        />
      )}
    </Block>
  );
}
