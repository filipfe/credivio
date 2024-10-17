import { Suspense } from "react";
import LatestOperations from "@/components/dashboard/latest-operations";
import { OperationLoader } from "@/components/operations/ref";
import Block from "@/components/ui/block";
import Limits from "@/components/operations/limits";
import GoalPriority from "@/components/dashboard/goal-priority";
import WeeklyGraph from "@/components/dashboard/weekly-graph";
import { getSettings } from "@/lib/general/actions";
import getDictionary from "@/const/dict";

export default async function Dashboard() {
  const settings = await getSettings();

  const {
    private: {
      dashboard: dict,
      goals: { priority },
      operations: {
        expenses: { limits },
      },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 h-full py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 xl:grid-rows-[max-content_max-content_1fr] gap-4 sm:gap-6">
      <Suspense
        fallback={<LatestOperationsFallback dict={dict["latest-operations"]} />}
      >
        <LatestOperations
          dict={dict["latest-operations"]}
          languageCode={settings.language}
        />
      </Suspense>
      <Limits dict={limits} settings={settings} />
      <Suspense>
        <GoalPriority dict={priority} />
      </Suspense>
      <WeeklyGraph settings={settings} dict={dict["weekly-graph"]} />
    </div>
  );
}

const LatestOperationsFallback = ({ dict }: { dict: { title: string } }) => (
  <Block title={dict.title} className="xl:col-span-6">
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
