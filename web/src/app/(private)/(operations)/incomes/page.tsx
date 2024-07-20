import OperationsByMonth from "@/components/dashboard/operations-by-month";
import Stat from "@/components/dashboard/stats/ref";
import IncomeTable from "@/components/operations/table";
import Loader from "@/components/stocks/loader";
import LineChartLoader from "@/components/ui/charts/line-loader";
import { getOperationsStats } from "@/lib/operations/actions";
import { getDefaultCurrency } from "@/lib/settings/actions";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Providers from "../providers";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { result: defaultCurrency, error } = await getDefaultCurrency();

  if (!defaultCurrency) {
    console.error("Couldn't retrieve default currency: ", error);
    throw new Error(error);
  }

  const { result } = await getOperationsStats(defaultCurrency, "income");

  if (!result) {
    throw new Error("Wystąpił błąd, spróbuj ponownie!");
  }

  const { last_month, last_day } = result;

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 sm:grid grid-cols-2 xl:grid-cols-4 lg:grid-rows-[max-content_1fr]">
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
          stat={last_month}
        />
      </div>
      <Providers>
        <div className="col-[1/3] row-[2/3] flex flex-col order-last">
          <Suspense fallback={<LineChartLoader />}>
            <OperationsByMonth
              withPeriod
              defaultCurrency={defaultCurrency}
              type="income"
            />
          </Suspense>
        </div>
        <Suspense fallback={<Loader className="row-span-2 col-span-2" />}>
          <Incomes searchParams={searchParams} />
        </Suspense>
      </Providers>
    </div>
  );
}

async function Incomes({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient();
  const {
    data: { results: incomes, count },
  } = await supabase.rpc("get_incomes_own_rows", {
    p_page: searchParams.page,
    p_sort: searchParams.sort,
    p_search: searchParams.search,
    p_currency: searchParams.currency,
    p_from: searchParams.from,
    p_to: searchParams.to,
  });

  return (
    <div className="row-span-2 col-span-2 flex items-stretch">
      <IncomeTable
        title="Przychody"
        rows={incomes || []}
        count={count || 0}
        type="income"
      />
    </div>
  );
}
