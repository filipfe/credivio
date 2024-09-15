"use client";

import { Progress, cn } from "@nextui-org/react";
import { useMemo, useRef } from "react";
import useOutsideObserver from "@/hooks/useOutsideObserver";
import Menu from "./menu";
import numberFormat from "@/utils/formatters/currency";

export default function GoalRef(goal: Goal) {
  const { title, price, currency, deadline, payments } = goal;
  const formRef = useRef<HTMLFormElement>(null);

  useOutsideObserver(formRef, () =>
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  );

  const sum = useMemo(
    () => payments.reduce((prev, { amount }) => prev + amount, 0),
    [payments]
  );

  return (
    <div className="bg-primary rounded-lg max-h-max">
      <div className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col min-w-64 relative gap-1">
        <div className="absolute right-4 top-4">
          <Menu goal={goal} />
        </div>
        <small className="text-white/60 text-tiny">
          {deadline
            ? new Intl.DateTimeFormat("pl-PL", {
                dateStyle: "short",
              }).format(new Date(deadline))
            : "Bez terminu"}
        </small>
        <h3 className="text-white font-medium leading-tight line-clamp-1 text-lg">
          {title}
        </h3>
        <div className="h-10 flex items-end">
          <strong className="text-3xl font-bold text-white">
            {numberFormat(currency, sum, "compact")}
          </strong>
          <sub className="mb-2 ml-1.5 text-white text-sm">
            / {numberFormat(currency, price, "compact")}
          </sub>
        </div>
        <Progress
          color="secondary"
          value={sum}
          maxValue={price}
          aria-label={title}
          label="Zebrano"
          showValueLabel
          size="sm"
          className="my-2"
          classNames={{
            label: "text-[80%] text-white/60",
            value: "text-[80%] text-white/80",
          }}
        />
      </div>
    </div>
  );
}
