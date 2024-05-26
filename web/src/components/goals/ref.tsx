"use client";

import { Button, Input, Progress } from "@nextui-org/react";
import { CheckCircle2Icon, PlusIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import formatAmount, { formatMax } from "@/utils/operation/format-amount";
import { updateRow } from "@/lib/general/actions";
import useOutsideObserver from "@/hooks/useOutsideObserver";
import Menu from "./menu";
import numberFormat from "@/utils/formatters/currency";

export default function GoalRef(props: Goal) {
  const { id, title, price, saved: defaultSaved, currency, deadline } = props;
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
    <div
      className={`bg-white rounded-lg py-8 px-10 flex flex-col justify-between relative ${
        isCompleted ? "opacity-80" : "opacity-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          {deadline && (
            <small className="text-primary">
              {new Date(deadline).toLocaleDateString()}
            </small>
          )}
          <h3 className="text-lg line-clamp-1">{title}</h3>
        </div>
        {isCompleted ? (
          <div className=" text-primary">
            <CheckCircle2Icon />
          </div>
        ) : (
          <Menu goal={props} onAdd={() => setIsSavedEditable(true)} />
        )}
      </div>
      <div>
        <Progress
          color="primary"
          value={parseFloat(saved)}
          maxValue={price}
          aria-label={title}
          label="Zebrano"
          showValueLabel
          size="sm"
          className="my-2"
        />
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
    </div>
  );
}
