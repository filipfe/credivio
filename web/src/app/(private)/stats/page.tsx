import BalanceByMonth from "@/components/stats/balance-by-month";
import ExpensesByLabelChart from "@/components/stats/expenses-by-label-chart";
import { getPreferences } from "@/lib/settings/actions";
import Providers from "./providers";
import Filters from "@/components/stats/filters";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/stats/stats-list";
import { StatLoader } from "@/components/ui/stat-ref";

export default async function Page() {
  const preferences = await getPreferences();

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Providers>
        <Suspense fallback={statsFallback}>
          <StatsList />
        </Suspense>
        <ExpensesByLabelChart />
        <BalanceByMonth languageCode={preferences.language.code} />
        <Filters />
      </Providers>
    </div>
  );
}

const statsFallback = (
  <Fragment>
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
  </Fragment>
);
