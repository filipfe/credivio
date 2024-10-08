"use client";

import { Fragment, useContext } from "react";
import { useStatsData } from "@/lib/stats/queries";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import Comprasion from "./comparison";
import Stat, { StatLoader } from "./stat-ref";

export default function StatsList() {
  const { currency, month, year } = useContext(StatsFilterContext);
  const { data: results, isLoading: isLoading } = useStatsData(
    currency,
    month + 1,
    year
  );

  if (isLoading || !results) {
    return (
      <Fragment>
        <StatLoader className="xl:col-span-2" />
        <StatLoader className="xl:col-span-2" />
        <StatLoader className="xl:col-span-2" />
      </Fragment>
    );
  }

  const lastResult = results[results.length - 1];
  const maxIncome = lastResult.total_incomes;
  const maxExpense = lastResult.total_expenses;

  return (
    <div className="xl:col-span-1 grid grid-rows-2 gap-4 sm:gap-6 h-[479px] order-first xl:order-none">
      <div className="xl:row-span-1 grid grid-cols-2 gap-4 sm:gap-6">
        <Stat
          type="incomes"
          amount={maxIncome}
          data={results.map((item) => ({ total: item.total_incomes }))}
        />
        <Stat
          type="expenses"
          amount={maxExpense}
          data={results.map((item) => ({ total: item.total_expenses }))}
        />
      </div>
      <Comprasion
        incomes={maxIncome}
        expenses={maxExpense}
        balance={maxIncome - maxExpense}
        currency={currency}
      />
      {/* <Incomes /> */}
    </div>
  );
}
