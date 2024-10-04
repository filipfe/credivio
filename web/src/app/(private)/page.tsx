// import PortfolioStructure from "@/components/dashboard/portfolio-structure/grid";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/dashboard/stats/list";
import LatestOperations from "@/components/dashboard/latest-operations";
import { OperationLoader } from "@/components/operations/ref";
import Block from "@/components/ui/block";
import { getPreferences } from "@/lib/settings/actions";
import Priority from "@/components/goals/priority";
import { createClient } from "@/utils/supabase/server";
import Limits from "@/components/operations/limits";
import ExpensesByLabel from "@/components/operations/expenses-by-label";
import { StatLoader } from "@/components/ui/stat-ref";

export default async function Dashboard() {
  const { result: preferences, error } = await getPreferences();

  if (error || !preferences) {
    throw new Error(error || "Preferences could not be retrieved");
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <Suspense fallback={statsFallback}>
        <StatsList defaultCurrency={preferences.currency} />
      </Suspense>
      <Suspense fallback={latestOperationsFallback}>
        <LatestOperations preferences={preferences} />
      </Suspense>
      <Limits defaultCurrency={preferences.currency} />
      <Suspense>
        <GoalPriority />
      </Suspense>
      <ExpensesByLabel className="col-span-3" preferences={preferences} />
      {/* <ExpensesByLabelChart defaultCurrency={preferences.currency} />
      <BalanceByMonth preferences={preferences} /> */}
    </div>
  );
}

async function GoalPriority() {
  const supabase = createClient();
  const { data: goal } = await supabase
    .from("goals")
    .select("title, price, currency, payments:goals_payments(date, amount)")
    .eq("is_priority", true)
    .order("date", { referencedTable: "goals_payments", ascending: false })
    .returns<Goal[]>()
    .single();

  if (!goal) return <></>;

  return (
    <div className="col-span-3">
      <Priority goal={goal} />
    </div>
  );
}

const latestOperationsFallback = (
  <Block title="Ostatnie operacje" className="xl:col-span-6">
    <div className="grid grid-cols-6 gap-6">
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
      <OperationLoader />
    </div>
  </Block>
);

const statsFallback = (
  <Fragment>
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
    <StatLoader className="xl:col-span-2" />
  </Fragment>
);
