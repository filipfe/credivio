import Priority from "@/components/goals/preview";
import Timeline from "@/components/goals/timeline";
import TimelineProvider from "@/app/(private)/goals/providers";
import GoalRef from "@/components/goals/ref";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getActiveGoals, getGoals, getPriorityGoal } from "@/lib/goals/actions";

export default async function Page() {
  const [goalsData, activeGoalsData, priorityGoalData] = await Promise.all([
    getGoals(),
    getActiveGoals(),
    getPriorityGoal(),
  ]);

  const goals = goalsData.results;
  const activeGoals = activeGoalsData.results;
  const priorityGoal = priorityGoalData.results;

  return (
    <div className="px-10 pt-8 pb-24 flex flex-col h-full gap-8">
      <TimelineProvider>
        <HorizontalScroll>
          {goals.map((item) => (
            <GoalRef {...item} key={item.id} />
          ))}
        </HorizontalScroll>
        <div className="grid gap-6 2xl:grid-cols-2 grid-cols-1">
          <Timeline goals={activeGoals} />
          {priorityGoal && <Priority {...priorityGoal} />}
        </div>
      </TimelineProvider>
    </div>
  );
}
