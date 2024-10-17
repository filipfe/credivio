import OperationTable from "@/components/operations/table";
import Stat from "@/components/ui/stat-ref";
import { Suspense } from "react";
import Loader from "@/components/stocks/loader";
import { getOperationsStats } from "@/lib/operations/actions";
import { createClient } from "@/utils/supabase/server";
import Providers from "../providers";
import OperationsByMonth from "@/components/operations/operations-by-month";
import Limits from "@/components/operations/limits";
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
      general: { expenses: title },
    },
  } = await getDictionary(settings.language);

  const { result } = await getOperationsStats(
    settings.timezone,
    settings.currency,
    "expense"
  );

  if (!result) {
    throw new Error("Failed to fetch the resource!");
  }

  const { last_month, last_day } = result;

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-[max-content_max-content_1fr]">
      <Limits dict={dict.expenses.limits} settings={settings} />
      <div className="col-[1/2]">
        <Stat
          title={dict.stats["today"]}
          description=""
          currency={settings.currency}
          stat={last_day}
        />
      </div>
      <div className="col-[2/3]">
        <Stat
          title={dict.stats["30-days"]}
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
        <div className="col-start-1 col-end-3 row-start-3 row-end-3 flex flex-col order-last">
          <OperationsByMonth
            type="expense"
            settings={settings}
            title={title}
            dict={dict["operations-by-month"]}
          />
        </div>
        <Suspense fallback={<Loader className="row-span-3 col-span-2" />}>
          <Expenses
            searchParams={searchParams}
            settings={settings}
            dict={{ title, ...dict["operation-table"] }}
          />
        </Suspense>
      </Providers>
    </div>
  );
}

async function Expenses({
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
    data: { results: expenses, count },
  } = await supabase.rpc("get_expenses_own_rows", {
    p_timezone: settings.timezone,
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
        type="expense"
        rows={expenses || []}
        count={count || 0}
        settings={settings}
        dict={dict}
      />
    </div>
  );
}
