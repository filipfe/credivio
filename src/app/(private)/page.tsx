import PortfolioStructure from "@/components/dashboard/portfolio-structure";
import { Skeleton } from "@nextui-org/react";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/dashboard/stats/list";
import Loader from "@/components/stocks/loader";
import ExpensesByLabel from "@/components/dashboard/charts/expenses-by-label";
import BudgetByMonth from "@/components/dashboard/charts/budget-by-month";
import ChartLoader from "@/components/dashboard/charts/loader";

export default function Dashboard() {
  return (
    <div className="sm:px-12 py-4 sm:py-8 sm:pb-24 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Suspense
        fallback={
          <Fragment>
            <Skeleton className="xl:col-span-2" />
            <Skeleton className="xl:col-span-2" />
            <Skeleton className="xl:col-span-2" />
          </Fragment>
        }
      >
        <StatsList />
      </Suspense>
      <Suspense fallback={<ChartLoader />}>
        <ExpensesByLabel />
      </Suspense>
      <Suspense fallback={<ChartLoader />}>
        <BudgetByMonth />
      </Suspense>
      <Suspense fallback={<Loader className="col-span-6" />}>
        <PortfolioStructure />
      </Suspense>
    </div>
  );
}
