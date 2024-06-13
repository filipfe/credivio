"use client";

import { useContext, useRef, useState, useTransition } from "react";
import Block from "../ui/block";
import RadialChart from "../ui/charts/radial-chart";
import { TimelineContext } from "@/app/(private)/goals/providers";
import numberFormat from "@/utils/formatters/currency";
import Menu from "./menu";
import { AlertOctagonIcon, PlusIcon } from "lucide-react";
import { Button, Input, Tooltip } from "@nextui-org/react";
import formatAmount, { formatMax } from "@/utils/operation/format-amount";
import { updateRow } from "@/lib/general/actions";
import useOutsideObserver from "@/hooks/useOutsideObserver";

export default function Preview(priorityGoal: Goal) {
  const { activeRecord } = useContext(TimelineContext);
  const goal = activeRecord || priorityGoal;
  const { id, title, saved: defaultSaved, price, currency, is_priority } = goal;
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(defaultSaved.toString());
  const [isSavedEditable, setIsSavedEditable] = useState(false);
  const isCompleted = parseFloat(saved) >= price;

  function handleAdd() {
    if (isPending || saved === defaultSaved.toString()) return;
    const valid = (prev: string) =>
      formatMax(parseFloat(prev || defaultSaved.toString() || "0"), price);
    setSaved(valid);
    startTransition(async () => {
      await updateRow(id, "goal", { saved: valid(saved) });
      setIsSavedEditable(false);
    });
  }

  useOutsideObserver(formRef, () =>
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  );

  return (
    <Block
      title={
        is_priority ? (
          <div className="flex items-center gap-2">
            <Tooltip closeDelay={0} content="Priorytet">
              <AlertOctagonIcon className="text-secondary" size={20} />
            </Tooltip>
            <h3 className="text-lg line-clamp-1">{title}</h3>
          </div>
        ) : (
          <h3 className="text-lg line-clamp-1">{title}</h3>
        )
      }
      cta={<Menu goal={goal} onAdd={() => setIsSavedEditable(true)} />}
    >
      <div className="flex flex-col items-center h-full w-full">
        <RadialChart data={[{ value: ((defaultSaved || 0) / price) * 100 }]} />
        <div className="text-xl my-4 flex items-center gap-4 justify-between">
          {isSavedEditable ? (
            <form
              ref={formRef}
              className="relative flex items-center"
              action={handleAdd}
            >
              <Input
                isDisabled={isPending}
                classNames={{ inputWrapper: "!border-[1px]" }}
                variant="bordered"
                value={saved}
                onChange={(e) =>
                  setSaved(formatAmount(e.target.value, { max: price }))
                }
              />
              <Button
                onClick={() =>
                  setSaved((prev) =>
                    formatMax(parseFloat(prev) + price / 10, price)
                  )
                }
                isDisabled={isPending}
                className="absolute right-2 !w-6 min-w-0 h-6 grid place-content-center"
                color="primary"
                variant="flat"
                size="sm"
              >
                <PlusIcon size={16} />
              </Button>
            </form>
          ) : (
            <span>{numberFormat(currency, parseFloat(saved))}</span>
          )}
          <span>/</span>
          <span>{numberFormat(currency, price)}</span>
        </div>
      </div>
    </Block>
  );
}
