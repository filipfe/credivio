"use client";

import { Section } from "@/components/ui/block";
import Option from "./option";
import { cn, Progress, Skeleton } from "@nextui-org/react";
import { useGoals } from "@/lib/goals/queries";
import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";
import NumberFormat from "@/utils/formatters/currency";
import Empty from "@/components/ui/empty";
import { Dict } from "@/const/dict";

export default function GoalsContext({
  dict,
}: {
  dict: Dict["private"]["ai-assistant"]["context"]["form"]["goals"] & {
    _error: string;
  };
}) {
  const { currency } = useAIAssistant();
  const { data: goals, error, isLoading } = useGoals(currency);

  return (
    <Section title={dict.title}>
      {error ? (
        <div className="pt-6 pb-4">
          <p className="text-danger text-sm text-center">{dict._error}</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col sm:grid grid-cols-3 gap-3">
          <Skeleton className="h-[62px] rounded-md" />
          <Skeleton className="h-[62px] rounded-md" />
          <Skeleton className="h-[62px] rounded-md" />
        </div>
      ) : goals && goals.length > 0 ? (
        <div className="flex flex-col sm:grid grid-cols-3 gap-3">
          {goals.map((goal) => (
            <GoalRef goal={goal} currency={currency} />
          ))}
        </div>
      ) : (
        <Empty title={dict._empty} />
      )}
    </Section>
  );
}

const GoalRef = ({ goal, currency }: { goal: Goal; currency: string }) => {
  const { id, title, price, total_paid } = goal;
  const { goal: selectedGoal, setGoal } = useAIAssistant();
  const isActive = selectedGoal ? selectedGoal.id === id : false;

  return (
    <Option
      id={`goal-${id}`}
      isActive={isActive}
      onActiveChange={(checked) => setGoal(checked ? goal : undefined)}
      className="flex flex-col gap-2"
    >
      <h4 className="font-medium text-sm">{title}</h4>
      <small className="font-medium opacity-80">
        <NumberFormat currency={currency} amount={total_paid} /> /{" "}
        <NumberFormat currency={currency} amount={price} />
      </small>
      <Progress
        size="sm"
        value={total_paid}
        maxValue={price}
        classNames={{ indicator: cn(isActive && "bg-secondary") }}
      />
    </Option>
  );
};
