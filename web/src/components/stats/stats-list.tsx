"use client";

import { Fragment, useContext } from "react";
import Stat from "../ui/stat-ref";
import { useStats } from "@/lib/stats/queries";
import { StatsFilterContext } from "@/app/(private)/stats/providers";

export default function StatsList() {
  const { currency } = useContext(StatsFilterContext);

  const { data: result, isLoading } = useStats(currency);

  if (isLoading) {
    return null;
  }

  const { incomes, expenses, balance } = result;

  return (
    <Fragment>
      <Stat
        title="Przychody"
        currency={currency}
        description=""
        amount={incomes}
      />
      <Stat
        title="Wydatki"
        currency={currency}
        description=""
        amount={expenses}
      />
      <Stat
        title="Bilans"
        currency={currency}
        description=""
        amount={balance}
      />
    </Fragment>
  );
}
