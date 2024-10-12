import { Suspense } from "react";
import LatestOperations from "@/components/dashboard/latest-operations";
import { OperationLoader } from "@/components/operations/ref";
import Block from "@/components/ui/block";
import { getPreferences } from "@/lib/settings/actions";
import Limits from "@/components/operations/limits";
import GoalPriority from "@/components/dashboard/goal-priority";
import WeeklyGraph from "@/components/dashboard/weekly-graph";

export default async function Dashboard() {
  const { result: preferences, error } = await getPreferences();

  if (error || !preferences) {
    throw new Error(error || "Preferences could not be retrieved");
  }

  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div className="sm:px-10 h-full py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 xl:grid-rows-[max-content_max-content_1fr] gap-4 sm:gap-6">
      <Suspense fallback={latestOperationsFallback}>
        <LatestOperations preferences={preferences} />
      </Suspense>
      <Limits defaultCurrency={preferences.currency} />
      <Suspense>
        <GoalPriority />
      </Suspense>
      <WeeklyGraph preferences={preferences} />
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
