"use client";

import { Progress } from "@nextui-org/react";
import { useRef } from "react";
import useOutsideObserver from "@/hooks/useOutsideObserver";
import Menu from "./menu";
import NumberFormat from "@/utils/formatters/currency";
import { useSettings } from "@/lib/general/queries";
import { Dict } from "@/const/dict";

export default function GoalRef({
  dict,
  goal,
}: {
  dict: Dict["private"]["goals"]["list"]["goal"];
  goal: Goal;
}) {
  const { data: settings } = useSettings();

  const { title, price, currency, deadline, total_paid } = goal;
  const formRef = useRef<HTMLFormElement>(null);

  useOutsideObserver(formRef, () =>
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  );

  return (
    <div className="bg-primary rounded-lg max-h-max">
      <div className="border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col min-w-64 relative gap-1">
        <div className="absolute right-4 top-4">
          <Menu dict={dict.menu} goal={goal} />
        </div>
        <small className="text-white/60 text-tiny">
          {deadline
            ? new Intl.DateTimeFormat(settings?.language, {
                dateStyle: "short",
              }).format(new Date(deadline))
            : dict["no-deadline"]}
        </small>
        <h3 className="text-white font-medium leading-tight line-clamp-1 text-lg">
          {title}
        </h3>
        <div className="h-10 flex items-end">
          <strong className="text-3xl font-bold text-white">
            <NumberFormat
              currency={currency}
              amount={total_paid}
              notation="compact"
            />
          </strong>
          <sub className="mb-2 ml-1.5 text-white text-sm">
            /{" "}
            <NumberFormat
              currency={currency}
              amount={price}
              notation="compact"
            />
          </sub>
        </div>
        <Progress
          color="secondary"
          value={total_paid}
          maxValue={price}
          aria-label={title}
          label={dict.collected}
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
