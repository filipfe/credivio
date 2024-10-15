"use client";

import Empty from "../ui/empty";
import { Skeleton } from "@nextui-org/react";
import { useLimits } from "@/lib/general/queries";
import Block from "../ui/block";
import NumberFormat from "@/utils/formatters/currency";
import { useWeeklyGraph } from "@/lib/dashboard/queries";
import { Dict } from "@/const/dict";

export default function WeeklyGraph({
  settings,
  dict,
}: {
  settings: Settings;
  dict: Dict["private"]["dashboard"]["weekly-graph"];
}) {
  const { data: days, isLoading } = useWeeklyGraph(
    settings.timezone,
    settings.currency
  );
  const { data: limits } = useLimits(settings.timezone, settings.currency);

  const sum =
    days?.reduce(
      (prev: number, curr: DailyAmount) => prev + curr.total_amount,
      0
    ) || 0;

  const limit = limits
    ? limits.find((limit) => limit.period === "weekly")
    : null;

  return (
    <Block className="grid lg:col-span-2 xl:col-span-3">
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-1">
            <Skeleton className="h-5 w-44 rounded-md" />
            <div className="flex items-end gap-2">
              <Skeleton className="h-9 w-40 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          </div>
          <div className="flex-1 min-h-64 flex gap-4 w-full">
            <div className="border-r mb-9 mr-3 flex flex-col justify-between items-end self-stretch">
              <div className="relative flex h-px min-w-max items-center border-b pr-2">
                <div className="bg-white px-0.5">
                  <p className="mr-2 min-w-max text-sm font-semibold leading-none"></p>
                </div>
              </div>
              <div className="relative flex h-px min-w-max items-center border-b pr-2">
                <div className="bg-white px-0.5">
                  <p className="mr-2 min-w-max text-sm font-semibold leading-none"></p>
                </div>
              </div>
              <div className="relative flex h-px min-w-max items-center border-b pr-2">
                <div className="bg-white px-0.5">
                  <p className="mr-2 min-w-max text-sm font-semibold leading-none"></p>
                </div>
              </div>
            </div>
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 items-center flex-1"
              >
                <Skeleton className="w-full flex-1 rounded-md" />
                <Skeleton className="h-6 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ) : days ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-1">
            <h2 className="text-font/75 text-sm">{dict.title}</h2>
            <div className="flex items-end gap-2">
              <strong className="text-3xl">
                <NumberFormat currency={settings.currency} amount={sum} />
              </strong>
              {limit && (
                <sub className="text-font/60 mb-1 text-lg">
                  /{" "}
                  <NumberFormat
                    currency={settings.currency}
                    amount={limit.amount}
                  />
                </sub>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-64 flex gap-4 w-full text-base leading-normal text-black">
            <div className="border-r mb-9 mr-3 flex flex-col justify-between items-end self-stretch">
              <div className="relative flex h-px min-w-max items-center border-b pr-2">
                <div className="bg-white px-0.5">
                  <p className="mr-2 min-w-max text-sm font-semibold leading-none"></p>
                </div>
              </div>
              <div className="relative flex h-px min-w-max items-center border-b pr-2">
                <div className="bg-white px-0.5">
                  <p className="mr-2 min-w-max text-sm font-semibold leading-none"></p>
                </div>
              </div>
              <div className="relative flex h-px min-w-max items-center border-b pr-2">
                <div className="bg-white px-0.5">
                  <p className="mr-2 min-w-max text-sm font-semibold leading-none"></p>
                </div>
              </div>
            </div>
            {days.map((day: DailyAmount) => (
              <DayRef
                key={day.date}
                language={settings.language}
                date={day.date}
                daySum={day.total_amount}
                weekSum={sum}
              />
            ))}
          </div>
        </div>
      ) : (
        <Empty title={dict._empty} />
      )}
    </Block>
  );
}

type DayProps = {
  language: string;
  date: string;
  daySum: number;
  weekSum: number;
};

const DayRef = ({ language, date, daySum, weekSum }: DayProps) => {
  return (
    <div className="flex flex-col gap-2 items-center flex-1">
      <div className="bg-light rounded-md border flex flex-col overflow-hidden justify-end w-full flex-1">
        <div
          style={{
            height: `${(daySum / weekSum) * 100}%`,
          }}
          className="relative flex flex-col-reverse bg-primary"
        >
          <h3 className="self-center absolute -top-8"></h3>
        </div>
      </div>
      <h2 className="font-bold">
        {new Intl.DateTimeFormat(language, {
          weekday: "short",
        }).format(new Date(date))}
      </h2>
    </div>
  );
};
