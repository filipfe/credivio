import PortfolioStructure from "@/components/dashboard/portfolio-structure/grid";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/dashboard/stats/list";
import ExpensesByLabel from "@/components/dashboard/charts/expenses-by-label";
import { StatLoader } from "@/components/dashboard/stats/ref";
import OperationsByMonth from "@/components/dashboard/charts/operations-by-month";
import LatestOperations from "@/components/dashboard/operations/latest-operations";
import { OperationLoader } from "@/components/dashboard/operations/ref";
import { getDefaultCurrency } from "@/lib/settings/actions";

export default async function Dashboard() {
  const defaultCurrency = await getDefaultCurrency();

  return (
    <div className="sm:px-10 py-4 sm:py-8 sm:pb-24 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Suspense fallback={latestOperationsFallback}>
        <LatestOperations />
      </Suspense>
      <Suspense fallback={statsFallback}>
        <StatsList defaultCurrency={defaultCurrency} />
      </Suspense>
      <ExpensesByLabel defaultCurrency={defaultCurrency} />
      <OperationsByMonth defaultCurrency={defaultCurrency} type="budget" />
      <Suspense fallback={latestOperationsFallback}>
        <PortfolioStructure />
      </Suspense>
    </div>
  );
}

const latestOperationsFallback = (
  <Fragment>
    <OperationLoader className="xl:col-span-1" />
    <OperationLoader className="xl:col-span-1" />
    <OperationLoader className="xl:col-span-1" />
    <OperationLoader className="xl:col-span-1" />
    <OperationLoader className="xl:col-span-1" />
    <OperationLoader className="xl:col-span-1" />
  </Fragment>
);

const statsFallback = (
  <Fragment>
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
  </Fragment>
);
