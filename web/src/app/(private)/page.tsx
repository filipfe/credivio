// import PortfolioStructure from "@/components/dashboard/portfolio-structure/grid";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/dashboard/stats/list";
import ExpensesByLabel from "@/components/dashboard/expenses-by-label";
import { StatLoader } from "@/components/dashboard/stats/ref";
import BalanceByMonth from "@/components/dashboard/balance-by-month";
import LatestOperations from "@/components/dashboard/latest-operations";
import { OperationLoader } from "@/components/operations/ref";
import Block from "@/components/ui/block";
import { getPreferences } from "@/lib/settings/actions";

export default async function Dashboard() {
  const { result: preferences, error } = await getPreferences();

  if (!preferences) {
    console.error("Couldn't retrieve preferences: ", error);
    throw new Error(error);
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Suspense fallback={statsFallback}>
        <StatsList defaultCurrency={preferences.currency} />
      </Suspense>
      <Suspense fallback={latestOperationsFallback}>
        <LatestOperations />
      </Suspense>
      <ExpensesByLabel defaultCurrency={preferences.currency} />
      <BalanceByMonth preferences={preferences} />
      {/* <Suspense fallback={latestOperationsFallback}>
        <PortfolioStructure />
      </Suspense> */}
    </div>
  );
}

const latestOperationsFallback = (
  <Block title="Ostatnie operacje" className="xl:col-span-6">
    <div className="grid grid-cols-6 gap-6">
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
    </div>
  </Block>
);

const statsFallback = (
  <Fragment>
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
  </Fragment>
);
