import { createClient } from "@/utils/supabase/server";
import Priority from "../goals/priority-goal/priority";
import { Dict } from "@/const/dict";
import { getPriorityGoal } from "@/lib/goals/actions";
import Block from "../ui/block";

export default async function GoalPriority({
  dict,
}: {
  dict: Dict["private"]["goals"]["priority"];
}) {
  const { result: goal } = await getPriorityGoal(5);

  if (!goal) return <></>;

  return (
    <div className="col-span-3 [&>div]:w-full flex items-stretch">
      <Block>
        <Priority dict={dict} goal={goal} />
      </Block>
    </div>
  );
}
