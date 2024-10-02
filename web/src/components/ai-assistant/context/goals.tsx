"use client";

import { Section } from "@/components/ui/block";
import Option from "./option";
import { cn, Progress, Skeleton } from "@nextui-org/react";
import { useGoals } from "@/lib/goals/queries";
import numberFormat from "@/utils/formatters/currency";
import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";

export default function GoalsContext() {
  const { data: goals, error, isLoading } = useGoals();

  return (
    <Section title="Cele">
      {error ? (
        <div className="pt-6 pb-4">
          <p className="text-danger text-sm text-center">Wystąpił błąd</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {isLoading ? (
            <>
              <Skeleton className="h-[62px] rounded-md" />
              <Skeleton className="h-[62px] rounded-md" />
              <Skeleton className="h-[62px] rounded-md" />
            </>
          ) : (
            goals?.map((goal) => <GoalRef goal={goal} />)
          )}
        </div>
      )}
    </Section>
  );
}

const GoalRef = ({ goal }: { goal: Goal }) => {
  const { id, payments, title, price, currency } = goal;
  const { goal: selectedGoal, setGoal } = useAIAssistant();
  const isActive = selectedGoal ? selectedGoal.id === id : false;
  const paid = payments.reduce((prev, { amount }) => prev + amount, 0);
  return (
    <Option
      id={`goal-${id}`}
      isActive={isActive}
      onActiveChange={(checked) => setGoal(checked ? goal : undefined)}
      className="flex flex-col gap-2"
    >
      <h4 className="font-medium text-sm">{title}</h4>
      <small className="font-medium opacity-80">
        {numberFormat(currency, paid)} / {numberFormat(currency, price)}
      </small>
      <Progress
        size="sm"
        value={paid}
        maxValue={price}
        classNames={{ indicator: cn(isActive && "bg-secondary") }}
      />
    </Option>
  );
};
