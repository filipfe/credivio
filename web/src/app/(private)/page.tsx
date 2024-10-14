import { Suspense } from "react";
import LatestOperations from "@/components/dashboard/latest-operations";
import { OperationLoader } from "@/components/operations/ref";
import Block from "@/components/ui/block";
import Limits from "@/components/operations/limits";
import GoalPriority from "@/components/dashboard/goal-priority";
import WeeklyGraph from "@/components/dashboard/weekly-graph";
import { getSettings } from "@/lib/general/actions";

export default async function Dashboard() {
  const { result: settings } = await getSettings();

  if (!settings) {
    throw new Error("Couldn't retrieve settings");
  }

  return (
    <div className="sm:px-10 h-full py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 xl:grid-rows-[max-content_max-content_1fr] gap-4 sm:gap-6">
      <Suspense fallback={latestOperationsFallback}>
        <LatestOperations languageCode={settings.language} />
      </Suspense>
      <Limits settings={settings} />
      <Suspense>
        <GoalPriority />
      </Suspense>
      <WeeklyGraph settings={settings} />
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
