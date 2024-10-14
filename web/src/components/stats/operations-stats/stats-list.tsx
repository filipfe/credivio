"use client";

import { Fragment, useContext } from "react";
import { useStatsData } from "@/lib/stats/queries";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import Comparison from "./comparison";
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
        <StatLoader className="col-start-1 col-end-2 min-h-48" />
        <StatLoader className="col-start-2 col-end-3 min-h-48" />
        <StatLoader className="col-start-1 col-end-3" />
      </Fragment>
    );
  }

  const lastResult = results[results.length - 1];
  const maxIncome = lastResult.total_incomes;
  const maxExpense = lastResult.total_expenses;

  return (
    <>
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
      <Comparison
        incomes={maxIncome}
        expenses={maxExpense}
        balance={maxIncome - maxExpense}
        currency={currency}
      />
    </>
  );
}
