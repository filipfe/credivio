import OperationTable from "@/components/operations/table";
import { getOwnRows } from "@/lib/general/actions";
import Stat from "@/components/dashboard/stats/ref";
import { Suspense } from "react";
import Loader from "@/components/stocks/loader";
import LineChartLoader from "@/components/ui/charts/line-loader";
import { getOperationsStats } from "@/lib/operation/actions";
import OperationsByMonth from "@/components/dashboard/operations-by-month";
import { getDefaultCurrency } from "@/lib/settings/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const defaultCurrency = await getDefaultCurrency();
  const { result } = await getOperationsStats(defaultCurrency, "expense");

  if (!result) {
    throw new Error("Failed to fetch the resource!");
  }

  const { last_30_days, last_day } = result;

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-4 xl:grid-rows-[max-content_1fr]">
      <div className="col-[1/2]">
        <Stat
          title="Dzisiaj"
          description=""
          currency={defaultCurrency}
          stat={last_day}
        />
      </div>
      <div className="col-[2/3]">
        <Stat
          title="30 dni"
          description=""
          currency={defaultCurrency}
          stat={last_30_days}
        />
      </div>
      <div className="col-[1/3] row-[2/3]">
        <Suspense fallback={<LineChartLoader />}>
          <OperationsByMonth defaultCurrency={defaultCurrency} type="expense" />
        </Suspense>
      </div>
      <Suspense fallback={<Loader className="row-span-2 col-span-2" />}>
        <Expenses searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Expenses({ searchParams }: { searchParams: SearchParams }) {
  const { results: expenses, count } = await getOwnRows<Operation>(
    "expense",
    searchParams
  );

  return (
    <div className="row-span-2 col-span-2 flex items-stretch">
      <OperationTable
        title="Wydatki"
        type="expense"
        rows={expenses}
        count={count || 0}
      />
    </div>
  );
}
