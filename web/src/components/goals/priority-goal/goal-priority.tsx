import Block from "../../ui/block";
import Empty from "../../ui/empty";
import { Dict } from "@/const/dict";
import Priority from "./priority";
import { getPriorityGoal } from "@/lib/goals/actions";

type Props = {
  dict: Dict["private"]["goals"]["priority"];
};

export default async function GoalPriority({ dict }: Props) {
  const { result: goal } = await getPriorityGoal();

  return (
    <Block>
      {goal ? (
        <Priority dict={dict} goal={goal} />
      ) : (
        <Empty title={dict._empty} />
      )}
    </Block>
  );
}
