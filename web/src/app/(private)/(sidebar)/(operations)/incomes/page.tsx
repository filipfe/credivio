import OperationTable from "@/components/operations/table";
import Loader from "@/components/stocks/loader";
import { getOperationsStats } from "@/lib/operations/actions";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Providers from "../providers";
import OperationsByMonth from "@/components/operations/operations-by-month";
import Stat from "@/components/ui/stat-ref";
import { getSettings } from "@/lib/general/actions";
import getDictionary, { Dict } from "@/const/dict";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const settings = await getSettings();

  const {
    private: {
      operations: dict,
      general: { incomes: title },
    },
  } = await getDictionary(settings.language);

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
          title={dict.stats["today"]}
          currency={settings.currency}
          stat={last_day}
        />
      </div>
      <div className="col-[2/3]">
        <Stat
          title={dict.stats["30-days"]}
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
          <OperationsByMonth
            type="income"
            settings={settings}
            title={title}
            dict={dict["operations-by-month"]}
          />
        </div>
        <Suspense fallback={<Loader className="row-span-2 col-span-2" />}>
          <Incomes
            searchParams={searchParams}
            settings={settings}
            dict={{ title, ...dict["operation-table"] }}
          />
        </Suspense>
      </Providers>
    </div>
  );
}

async function Incomes({
  searchParams,
  settings,
  dict,
}: {
  searchParams: SearchParams;
  settings: Settings;
  dict: {
    title: Dict["private"]["general"]["incomes" | "expenses"];
  } & Dict["private"]["operations"]["operation-table"];
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
        title={dict.title}
        type="income"
        rows={incomes || []}
        count={count || 0}
        settings={settings}
        dict={dict}
      />
    </div>
  );
}
