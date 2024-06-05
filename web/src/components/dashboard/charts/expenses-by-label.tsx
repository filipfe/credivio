"use client";

import Block from "@/components/ui/block";
import BarChart from "@/components/ui/charts/bar-chart";
import ChartLoader from "@/components/ui/charts/loader";
import Empty from "@/components/ui/empty";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import useClientQuery from "@/hooks/useClientQuery";
import { getChartLabels } from "@/lib/operation/client";
import { useState } from "react";

export default function ExpensesByLabel({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const { isLoading, results } = useClientQuery<ChartLabel>({
    deps: [currency],
    query: getChartLabels(currency),
  });

  return (
    <Block
      className="xl:col-span-3"
      title="Wydatki wg Etykiety"
      cta={
        <UniversalSelect
          className="w-20"
          size="sm"
          name="currency"
          aria-label="Waluta"
          defaultSelectedKeys={[currency]}
          elements={CURRENCIES}
          onChange={(e) => setCurrency(e.target.value)}
        />
      }
    >
      <div className="h-96 flex flex-col">
        {isLoading ? (
          <ChartLoader className="!p-0" hideTitle />
        ) : results.length > 0 ? (
          <BarChart data={results} currency={currency} />
        ) : (
          <Empty
            title="Brak wydatków do wyświetlenia!"
            cta={{ title: "Dodaj wydatek", href: "/expenses/add" }}
          />
        )}
      </div>
    </Block>
  );
}
