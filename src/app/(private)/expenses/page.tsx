import OperationTable from "@/components/operations/table";
import { getOwnRows } from "@/lib/general/actions";
import Stat from "@/components/dashboard/stats/ref";
import BudgetByMonth from "@/components/dashboard/charts/budget-by-month";
import { Suspense } from "react";
import Loader from "@/components/stocks/loader";
import LineChartLoader from "@/components/ui/charts/line-loader";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 lg:grid grid-cols-4 lg:grid-rows-[max-content_1fr]">
      <div className="col-[1/2]">
        <Stat
          title="Dzisiaj"
          description=""
          currency="PLN"
          stat={{ amount: 124, difference: 42, is_positive: true }}
        />
      </div>
      <div className="col-[2/3]">
        <Stat
          title="30 dni"
          description=""
          currency="PLN"
          stat={{ amount: 124, difference: 42, is_positive: true }}
        />
      </div>
      <div className="col-[1/3] row-[2/3]">
        <Suspense fallback={<LineChartLoader />}>
          <BudgetByMonth />
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
