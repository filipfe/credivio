import OperationTable from "@/components/operations/table";
import Loader from "@/components/stocks/loader";
import { getOperationsStats } from "@/lib/operations/actions";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Providers from "../providers";
import OperationsByMonth from "@/components/operations/operations-by-month";
import Stat from "@/components/ui/stat-ref";
import { getSettings } from "@/lib/general/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const settings = await getSettings();

  const { result } = await getOperationsStats(
    settings.timezone,
    settings.currency,
    "income"
  );

  if (!result) {
    throw new Error("Wystąpił błąd, spróbuj ponownie!");
  }

  const { last_month, last_day } = result;

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 sm:grid grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-[max-content_1fr]">
      <div className="col-[1/2]">
        <Stat
          title="Dzisiaj"
          description=""
          currency={settings.currency}
          stat={last_day}
        />
      </div>
      <div className="col-[2/3]">
        <Stat
          title="30 dni"
          description=""
          currency={settings.currency}
          stat={last_month}
        />
      </div>
      <Providers
        defaultPeriod={{
          from: searchParams.from || "",
          to: searchParams.to || "",
        }}
      >
        <div className="col-[1/3] row-[2/3] flex flex-col order-last">
          <OperationsByMonth type="income" settings={settings} />
        </div>
        <Suspense fallback={<Loader className="row-span-2 col-span-2" />}>
          <Incomes searchParams={searchParams} settings={settings} />
        </Suspense>
      </Providers>
    </div>
  );
}

async function Incomes({
  searchParams,
  settings,
}: {
  searchParams: SearchParams;
  settings: Settings;
}) {
  const supabase = createClient();
  const {
    data: { results: incomes, count },
  } = await supabase.rpc("get_incomes_own_rows", {
    p_timezone: settings.timezone,
    p_page: searchParams.page,
    p_sort: searchParams.sort,
    p_search: searchParams.search,
    p_currency: searchParams.currency,
    p_from: searchParams.from,
    p_to: searchParams.to,
  });

  return (
    <div className="row-span-2 col-span-2 flex items-stretch">
      <OperationTable
        title="Przychody"
        type="income"
        rows={incomes || []}
        count={count || 0}
        settings={settings}
      />
    </div>
  );
}
