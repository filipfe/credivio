"use client";

import { Fragment, useContext } from "react";
import Stat from "../ui/stat-ref";
import { useStats } from "@/lib/stats/queries";
import { StatsFilterContext } from "@/app/(private)/stats/providers";

export default function StatsList() {
  const { currency, month, year } = useContext(StatsFilterContext);
  const { data: result, isLoading } = useStats(currency, month + 1, year);

  if (isLoading || !result) {
    return null;
  }

  const { incomes, expenses, balance } = result;

  return (
    <Fragment>
      <Stat title="Przychody" currency={currency} amount={incomes} />
      <Stat title="Wydatki" currency={currency} amount={expenses} />
      <Stat title="Bilans" currency={currency} amount={balance} />
    </Fragment>
  );
}
