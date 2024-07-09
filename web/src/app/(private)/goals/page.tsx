import Table from "@/components/goals/table";
import List from "@/components/goals/list";
import Priority from "@/components/goals/priority";
import { getGoals } from "@/lib/goals/actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const { results: goals, error } = await getGoals();
  if (goals.length === 0 && !error) redirect("/goals/add");
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 grid-rows-[max-content_1fr]">
      <List goals={goals} />
      <Table goals={goals} />
      <Priority goal={goals.find((goal: Goal) => goal.is_priority)} />
    </div>
  );
}
