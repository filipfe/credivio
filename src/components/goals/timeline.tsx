import { Fragment } from "react";
import Block from "../ui/block";
import { Button, Chip, ScrollShadow } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

export default function Timeline({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) return;
  return (
    <Block title="Oś czasu">
      <ScrollShadow orientation="horizontal" hideScrollBar>
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
          {goals.map((goal, i, arr) => (
            <DayRef
              goal={goal}
              prevGoal={{
                deadline: i === 0 ? new Date() : new Date(arr[i - 1].deadline!),
              }}
              key={goal.id}
            />
          ))}
        </div>
      </ScrollShadow>
    </Block>
  );
}

const DayRef = ({
  goal: { title, deadline, price, saved, currency },
  prevGoal: { deadline: prevDeadline },
}: {
  goal: Goal;
  prevGoal: { deadline: Date };
}) => {
  const isCompleted = saved! >= price;
  // const timeDiffForPrev = new Date(deadline).getTime() - prevDeadline.getTime();
  const timeDiffForToday = new Date(deadline!).getTime() - new Date().getTime();
  // const daysLeftFromPrev = Math.round(timeDiffForPrev / (1000 * 3600 * 24));
  const daysLeftFromToday = Math.round(timeDiffForToday / (1000 * 3600 * 24));
  const left = price - saved!;

  return (
    <Fragment>
      <div className="relative flex flex-col items-center">
        <div className="absolute top-[calc(100%+8px)]">
          <Chip size="sm" color="primary" variant="flat">
            {new Intl.NumberFormat("pl-PL", {
              style: "currency",
              currency: currency || "PLN",
            }).format(left)}
          </Chip>
        </div>
      </div>
      <div className="bg-white grid place-content-center h-5 w-5">
        <div className="bg-primary rounded-full h-2.5 w-2.5 flex flex-col items-center justify-center relative">
          <div
            className={`absolute top-[calc(100%+8px)] flex flex-col items-center text-center ${
              isCompleted ? "opacity-60" : "opacity-100"
            }`}
          >
            <span className="text-primary text-[12px] font-medium">
              {new Date(deadline!).toLocaleDateString()}
            </span>
            <h3 className="text-sm line-clamp-2">{title}</h3>
          </div>
          <div className="absolute bottom-[calc(100%+8px)]">
            <Chip size="sm" color="primary" variant="light">
              {daysLeftFromToday} {daysLeftFromToday === 1 ? "dzień" : "dni"}{" "}
              {/* {daysLeftFromPrev !== daysLeftFromToday &&
                `(${daysLeftFromPrev} ${
                  daysLeftFromPrev === 1 ? "dzień" : "dni"
                })`} */}
            </Chip>
          </div>
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
        </div>
      </div>
    </Fragment>
  );
};
