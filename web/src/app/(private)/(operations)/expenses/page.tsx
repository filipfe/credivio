import OperationTable from "@/components/operations/table";
import Stat from "@/components/ui/stat-ref";
import { Suspense } from "react";
import Loader from "@/components/stocks/loader";
import { getOperationsStats } from "@/lib/operations/actions";
import { getDefaultCurrency } from "@/lib/settings/actions";
import { createClient } from "@/utils/supabase/server";
import Providers from "../providers";
import OperationsByMonth from "@/components/operations/operations-by-month";
import Limits from "@/components/operations/limits";

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

  const { result } = await getOperationsStats(defaultCurrency, "expense");

  if (!result) {
    throw new Error("Failed to fetch the resource!");
  }

  const { last_month, last_day } = result;

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-[max-content_max-content_1fr]">
      <Limits defaultCurrency={defaultCurrency} />
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
      <Providers
        defaultPeriod={{
          from: searchParams.from || "",
          to: searchParams.to || "",
        }}
      >
        <div className="col-start-1 col-end-3 row-start-3 row-end-3 flex flex-col order-last">
          <OperationsByMonth type="expense" />
        </div>
        <Suspense fallback={<Loader className="row-span-3 col-span-2" />}>
          <Expenses searchParams={searchParams} />
        </Suspense>
      </Providers>
    </div>
  );
}

async function Expenses({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient();
  const {
    data: { results: expenses, count },
  } = await supabase.rpc("get_expenses_own_rows", {
    p_page: searchParams.page,
    p_sort: searchParams.sort,
    p_search: searchParams.search,
    p_currency: searchParams.currency,
    p_label: searchParams.label,
    p_from: searchParams.from,
    p_to: searchParams.to,
  });

  return (
    <div className="row-span-2 col-span-2 flex items-stretch">
      <OperationTable
        title="Wydatki"
        type="expense"
        rows={expenses || []}
        count={count || 0}
      />
    </div>
  );
}
