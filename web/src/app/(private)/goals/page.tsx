import Table from "@/components/goals/table";
import List from "@/components/goals/list";
import { getSettings } from "@/lib/general/actions";
import getDictionary from "@/const/dict";
import GoalPriority from "@/components/goals/priority-goal/goal-priority";
import { getCurrentGoals, getGoalsPayments } from "@/lib/goals/actions";

export default async function Page() {
  const settings = await getSettings();
  const { results: goals } = await getCurrentGoals();
  const { results: tableData } = await getGoalsPayments(settings.timezone);
  const {
    private: { goals: dict },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 grid-rows-[max-content_1fr]">
      <List goals={goals} />
      <Table goals={goals} tableData={tableData} language={settings.language} />
      <GoalPriority dict={dict.priority} />
    </div>
  );
}
