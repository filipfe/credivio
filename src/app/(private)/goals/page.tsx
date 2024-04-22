import Priority from "@/components/goals/preview";
import Timeline from "@/components/goals/timeline";
import { getOwnRows } from "@/lib/general/actions";
import TimelineProvider from "@/app/(private)/goals/providers";
import GoalsList from "@/components/goals/list";

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
        {/* <Link href="/goals/add">
            <Button
              variant="flat"
              color="primary"
              className="border-dashed border-[1px] border-primary w-full h-full min-h-10"
              as="div"
            >
              <PlusIcon size={16} />
              Nowy
            </Button>
          </Link> */}
        <GoalsList goals={goals} />
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
