import PortfolioStructure from "@/components/dashboard/portfolio-structure/grid";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/dashboard/stats/list";
import Loader from "@/components/stocks/loader";
import ExpensesByLabel from "@/components/dashboard/charts/expenses-by-label";
import BudgetByMonth from "@/components/dashboard/charts/budget-by-month";
import ChartLoader from "@/components/ui/charts/loader";
import LineChartLoader from "@/components/ui/charts/line-loader";
import { StatLoader } from "@/components/dashboard/stats/ref";
import { getDefaultCurrency } from "@/lib/operation/actions";

export default async function Dashboard() {
  const defaultCurrency = await getDefaultCurrency();

  return (
    <div className="sm:px-10 py-4 sm:py-8 sm:pb-24 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Suspense fallback={statsFallback}>
        <StatsList defaultCurrency={defaultCurrency} />
      </Suspense>
      <Suspense fallback={<ChartLoader className="xl:col-span-3 min-h-96" />}>
        <ExpensesByLabel defaultCurrency={defaultCurrency} />
      </Suspense>
      <Suspense
        fallback={<LineChartLoader className="xl:col-span-3 min-h-96" />}
      >
        <BudgetByMonth />
      </Suspense>
      <Suspense fallback={<Loader className="col-span-6" />}>
        <PortfolioStructure />
      </Suspense>
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
