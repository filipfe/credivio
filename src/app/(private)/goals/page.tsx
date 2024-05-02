import Priority from "@/components/goals/preview";
import Timeline from "@/components/goals/timeline";
import { getOwnRows } from "@/lib/general/actions";
import TimelineProvider from "@/app/(private)/goals/providers";
import GoalRef from "@/components/goals/ref";
import HorizontalScroll from "@/components/ui/horizontal-scroll";

export default async function Page() {
  const { results: goals } = await getOwnRows<Goal>("goal");
  const havingDeadline = goals.filter(
    (goal) =>
      goal.deadline &&
      new Date(goal.deadline).getTime() - new Date().getTime() >= 0
  );
  const priority = goals.find((item) => item.is_priority);
  return (
    <div className="px-10 pt-8 pb-24 flex flex-col h-full gap-8">
      <TimelineProvider>
        <HorizontalScroll>
          {goals.map((item, k) => (
            <GoalRef {...item} key={`goal:${k}`} />
          ))}
        </HorizontalScroll>
        <div className="grid gap-6 2xl:grid-cols-2 grid-cols-1">
          <Timeline
            goals={havingDeadline.sort(
              (a, b) =>
                new Date(a.deadline as string).getTime() -
                new Date(b.deadline as string).getTime()
            )}
          />
          {priority && <Priority {...priority} />}
        </div>
      </TimelineProvider>
    </div>
  );
}
