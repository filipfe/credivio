"use client";

import { Fragment, useContext, useEffect, useRef } from "react";
import Block from "../ui/block";
import { Button, Chip, ScrollShadow } from "@nextui-org/react";
import { CheckIcon, PlusIcon } from "lucide-react";
import { TimelineContext } from "@/app/(private)/goals/providers";
import numberFormat from "@/utils/formatters/currency";

export default function Timeline({ goals }: { goals: ActiveGoal[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const { activeRecord } = useContext(TimelineContext);

  useEffect(() => {
    if (!activeRecord || !listRef.current) return;
    const element = document.getElementById(activeRecord.id);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [listRef.current, activeRecord]);

  if (goals.length === 0) return;

  return (
    <Block title="Oś czasu">
      <ScrollShadow orientation="horizontal" ref={listRef} hideScrollBar>
        <div className="bg-primary rounded-full h-0.5 flex items-center justify-between gap-32 mx-8 mt-10 mb-24 min-w-max">
          <div className="bg-white grid place-content-center h-5 w-5">
            <div className="bg-primary rounded-full h-2.5 w-2.5 flex flex-col items-center relative">
              <div className="absolute top-[calc(100%+8px)] flex flex-col items-center text-center">
                <span className="text-primary text-[12px] font-medium">
                  {new Date().toLocaleDateString()}
                </span>
                <h3 className="text-sm">Dzisiaj</h3>
              </div>
            </div>
          </div>
          {goals.map((goal) => (
            <DayRef
              goal={goal}
              isActive={goal.id === activeRecord?.id}
              key={goal.id}
            />
          ))}
        </div>
      </ScrollShadow>
    </Block>
  );
}

const DayRef = ({
  goal: { id, title, deadline, shortfall, currency, days_left },
  isActive,
}: {
  goal: ActiveGoal;
  isActive: boolean;
}) => {
  const isCompleted = shortfall === 0;

  return (
    <Fragment>
      <div className="relative flex flex-col items-center">
        <div className="absolute top-[calc(100%+8px)]">
          <Chip
            size="sm"
            color="primary"
            variant={isCompleted ? "solid" : "flat"}
            startContent={isCompleted ? <CheckIcon size={12} /> : undefined}
          >
            {isCompleted ? "Zebrano" : numberFormat(currency, shortfall)}
          </Chip>
        </div>
      </div>
      <div className="bg-white grid place-content-center h-5 w-5" id={id}>
        <div className="bg-primary/20 rounded-full h-2.5 w-2.5 flex flex-col items-center justify-center relative">
          <div
            className={`absolute top-[calc(100%+8px)] flex flex-col items-center text-center `}
          >
            <span className="text-primary text-[12px] font-medium">
              {new Date(deadline!).toLocaleDateString()}
            </span>
            <h3 className="text-sm line-clamp-2">{title}</h3>
          </div>
          <div className="absolute bottom-[calc(100%+8px)]">
            <Chip size="sm" color="primary" variant="light">
              {days_left} {days_left === 1 ? "dzień" : "dni"}{" "}
            </Chip>
          </div>
          {isCompleted ? (
            <div className="bg-white h-3 w-3 absolute grid place-content-center">
              <div className="w-5 h-5 bg-primary text-white rounded-full grid place-content-center">
                <CheckIcon size={12} />
              </div>
            </div>
          ) : isActive ? (
            <div className="bg-white h-3 w-3 absolute grid place-content-center">
              <div className="w-4 h-4 bg-secondary rounded-full" />
            </div>
          ) : (
            <div className="bg-white h-3 w-3 absolute opacity-0 hover:opacity-100 grid place-content-center">
              <Button
                className="!w-5 !min-w-0 !h-5 !p-0"
                color="primary"
                variant="flat"
                size="sm"
                radius="full"
                isIconOnly
              >
                <PlusIcon size={12} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};
