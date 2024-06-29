import Preview from "@/components/goals/preview";
import Timeline from "@/components/goals/timeline";
import TimelineProvider from "@/app/(private)/goals/providers";
import GoalRef from "@/components/goals/ref";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getGoals } from "@/lib/goals/actions";
import Block from "@/components/ui/block";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import GoalsTable from "@/components/goals/table";

export default async function Page() {
  const { results: goals, error } = await getGoals();

  if (goals.length === 0 && !error) redirect("/goals/add");

  // const priorityGoal = goals.find((goal) => goal.is_priority);

  // const activeGoals = goals.filter(
  //   (goal) =>
  //     goal.deadline && new Date(goal.deadline).getTime() >= new Date().getTime()
  // );

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6">
      {/* <TimelineProvider>
        <Block
          title="Bieżące"
          cta={
            <Link href="/goals/add">
              <Button
                as="div"
                variant="light"
                disableRipple
                startContent={<PlusIcon size={14} />}
              >
                Dodaj
              </Button>
            </Link>
          }
        >
          <HorizontalScroll>
            {goals.map((item) => (
              <GoalRef {...item} key={item.id} />
            ))}
          </HorizontalScroll>
        </Block>
        <div className="grid gap-6 2xl:grid-cols-2 grid-cols-1">
          <Timeline goals={activeGoals} />
          {priorityGoal && <Preview {...priorityGoal} />}
        </div>
      </TimelineProvider> */}
      <GoalsTable goals={goals} />
    </div>
  );
}
