import { getPreferences } from "@/lib/settings/actions";
import Providers from "./providers";
import Filters from "@/components/stats/filters";
import ExpensesByLabel from "@/components/stats/expenses-by-label";
import BalanceByMonth from "@/components/stats/balance-by-month";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/stats/operations-stats/stats-list";
import { StatLoader } from "@/components/stats/operations-stats/stat-ref";
import OperationsByDayOfWeek from "@/components/stats/operations-by-day-of-week";

export default async function Page() {
  const { result: preferences } = await getPreferences();

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Providers preferences={preferences!}>
        <Filters />
        <div className="xl:col-span-6 flex flex-col xl:grid grid-cols-2 gap-4 sm:gap-6">
          <StatsList />
          <BalanceByMonth />
        </div>
        <OperationsByDayOfWeek />
        <ExpensesByLabel />
      </Providers>
    </div>
  );
}
