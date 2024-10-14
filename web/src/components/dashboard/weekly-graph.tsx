"use client";

import { useLimits, useWeeklyGraph } from "@/lib/general/queries";
import { endOfWeek, startOfWeek } from "date-fns";
import Block from "../ui/block";
import NumberFormat from "@/utils/formatters/currency";

export default function WeeklyGraph({
  preferences,
}: {
  preferences: Preferences;
}) {
  const weekStart = startOfWeek(new Date(), {
    weekStartsOn: 1,
  });
  const weekEnd = endOfWeek(new Date(), {
    weekStartsOn: 1,
  });
  const { data: expenses } = useWeeklyGraph(
    preferences.currency,
    weekStart.toISOString(),
    weekEnd.toISOString()
  );

  const { data: limits } = useLimits(preferences.currency);

  const sum = expenses
    ? expenses.reduce((prev, curr) => prev + curr.amount, 0)
    : 0;

  const limit = limits
    ? limits.find((limit) => limit.period === "weekly")
    : null;

  return (
    <Block className="grid lg:col-span-2 xl:col-span-3">
      <div className="flex flex-col gap-6">
        <div className="grid gap-1">
          <h2 className="text-font/75 text-sm">Wydatki w tym tygodniu</h2>
          <div className="flex items-end gap-2">
            <strong className="text-3xl">
              <NumberFormat currency={preferences.currency} amount={sum} />
            </strong>
            {limit && (
              <sub className="text-font/60 mb-1 text-lg">
                /{" "}
                <NumberFormat
                  currency={preferences.currency}
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
          {Array.from(Array(7)).map((_, index) => {
            const date = startOfWeek(new Date(), {
              weekStartsOn: 1,
            });
            date.setDate(date.getDate() + index);

            return (
              <DayRef
                date={date}
                weekSum={sum}
                expenses={
                  expenses
                    ? expenses.filter(
                        ({ issued_at }) =>
                          new Date(issued_at).getDate() === date.getDate()
                      )
                    : []
                }
                key={index}
              />
            );
          })}
        </div>
      </div>
    </Block>
  );
}

type DayProps = {
  date: Date;
  expenses: Payment[];
  weekSum: number;
};

const DayRef = ({ date, expenses, weekSum }: DayProps) => {
  const daySum = expenses.reduce((prev, curr) => prev + curr.amount, 0);
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
        {new Intl.DateTimeFormat("pl-PL", {
          weekday: "short",
        }).format(date)}
      </h2>
    </div>
  );
};
