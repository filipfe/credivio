import { Fragment } from "react";
import Stat from "./ref";
import { getDashboardStats } from "@/lib/operation/actions";

export default async function StatsList() {
  const {
    results: [{ incomes, expenses, budget }],
  } = await getDashboardStats();
  return (
    <Fragment>
      <Stat title="Przychody" currency="PLN" description="" stat={incomes} />
      <Stat title="Wydatki" currency="PLN" description="" stat={expenses} />
      <Stat title="Budżet" currency="PLN" description="" stat={budget} />
    </Fragment>
  );
}
