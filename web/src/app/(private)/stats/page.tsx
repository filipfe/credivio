import BalanceByMonth from "@/components/stats/balance-by-month";
import ExpensesByLabelChart from "@/components/stats/expenses-by-label-chart";
import { getPreferences } from "@/lib/settings/actions";
import Providers from "./providers";
import Filters from "@/components/stats/filters";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/stats/stats-list";
import { StatLoader } from "@/components/ui/stat-ref";
import Limits from "@/components/stats/limits";
import { Skeleton } from "@nextui-org/react";

export default async function Page() {
  const preferences = await getPreferences();

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Providers>
        <Filters />
        <Suspense fallback={statsFallback}>
          <StatsList />
        </Suspense>
        {/* <Limits /> */}
        <ExpensesByLabelChart />
        <BalanceByMonth languageCode={preferences.language.code} />
      </Providers>
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

function LimitLoader({ className }: { className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[58px] h-[58px] border-[6px] border-default-300/50 rounded-full"></div>
      <div className="grid gap-2">
        <Skeleton className="w-24 h-2 rounded-full" />
        <Skeleton className="w-16 h-2 rounded-full" />
      </div>
    </div>
  );
}

const limitsFallback = (
  <Fragment>
    <LimitLoader />
    <LimitLoader />
    <LimitLoader />
  </Fragment>
);
