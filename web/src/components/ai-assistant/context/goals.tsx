"use client";

import { Section } from "@/components/ui/block";
import { Dispatch, SetStateAction, useState } from "react";
import Option from "./option";
import { cn, Progress, Skeleton } from "@nextui-org/react";
import { useGoals } from "@/lib/goals/queries";

export default function GoalsContext() {
  const { data: goals, error, isLoading } = useGoals();
  const [selected, setSelected] = useState<string>();

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
            goals?.map((goal) => (
              <GoalRef
                goal={goal}
                selected={selected}
                setSelected={setSelected}
              />
            ))
          )}
        </div>
      )}
    </Section>
  );
}

const GoalRef = ({
  goal: { id, payments, title, price, currency },
  selected,
  setSelected,
}: {
  goal: Goal;
  selected?: string;
  setSelected: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const paid = payments.reduce((prev, { amount }) => prev + amount, 0);
  return (
    <Option
      id={`goal-${id}`}
      isActive={id === selected}
      onActiveChange={(checked) => setSelected(checked ? id : undefined)}
      className="flex flex-col gap-2"
    >
      <h4 className="font-bold text-sm">{title}</h4>
      <Progress
        size="sm"
        value={paid}
        maxValue={price}
        classNames={{ indicator: cn(id === selected && "bg-secondary") }}
      />
    </Option>
  );
};
