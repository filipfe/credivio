import BudgetByMonth from "@/components/dashboard/charts/budget-by-month";
import Stat from "@/components/dashboard/stats/ref";
import IncomeTable from "@/components/operations/table";
import Loader from "@/components/stocks/loader";
import LineChartLoader from "@/components/ui/charts/line-loader";
import { getOwnRows } from "@/lib/general/actions";
import { getDefaultCurrency } from "@/lib/operation/actions";
import { Suspense } from "react";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 sm:grid grid-cols-2 xl:grid-cols-4 lg:grid-rows-[max-content_1fr]">
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
        <Incomes searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Incomes({ searchParams }: { searchParams: SearchParams }) {
  const { results: incomes, count } = await getOwnRows<Operation>(
    "income",
    searchParams
  );

  return (
    <div className="row-span-2 col-span-2 flex items-stretch">
      <IncomeTable
        title="Przychody"
        rows={incomes}
        count={count || 0}
        type="income"
      />
    </div>
  );
}
