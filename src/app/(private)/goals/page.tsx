import GoalRef from "@/components/goals/ref";
import Timeline from "@/components/goals/timeline";
import { getGoals } from "@/lib/goals/actions";

export default async function Page() {
  const { results: goals } = await getGoals();
  const havingDeadline = goals.filter((goal) => goal.deadline);
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full gap-8">
      <div
        className={`grid gap-6 ${
          havingDeadline.length > 2
            ? "grid-cols-1"
            : "2xl:grid-cols-2 grid-cols-1"
        }
      `}
      >
        <Timeline
          goals={havingDeadline.sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          )}
        />
      </div>
      <section className="flex flex-col lg:grid grid-cols-2 xl:grid-cols-4 gap-6">
        {goals.map((item, k) => (
          <GoalRef {...item} key={`goal:${k}`} />
        ))}
      </section>
    </div>
  );
}
