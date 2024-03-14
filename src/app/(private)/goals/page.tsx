import GoalRef from "@/components/goals/ref";
import { getGoals } from "@/lib/goals/actions";

export default async function Page() {
  const { results: goals } = await getGoals();
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full gap-8">
      <section className="flex flex-col lg:grid grid-cols-2 xl:grid-cols-4 gap-6">
        {goals.map((item, k) => (
          <GoalRef {...item} key={`goal:${k}`} />
        ))}
      </section>
    </div>
  );
}
