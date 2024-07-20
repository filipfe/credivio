"use client";

import { PeriodContext } from "@/app/(private)/(operations)/providers";
import Block from "@/components/ui/block";
import LineChart from "@/components/ui/charts/line-chart";
import LineChartLoader from "@/components/ui/charts/line-loader";
import Empty from "@/components/ui/empty";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { getBalances, getDailyTotalAmounts } from "@/lib/operations/queries";
import { useContext, useState } from "react";
import useSWR from "swr";

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

export default function OperationsByMonth({ type, withPeriod }: Props) {
  const periodContext = useContext(PeriodContext);
  const { data: results, isLoading } = useSWR("balances", () =>
    getBalances({})
  );

  return (
    <Block
      className="xl:col-span-3 flex-1"
      title={`${getTitle(type)} wg 30 dni`}
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
