"use client";

import {
  Button,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from "@nextui-org/react";
import Block from "../ui/block";
import { addDays, format, subDays } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import numberFormat from "@/utils/formatters/currency";
import { ChevronDown } from "lucide-react";
import Loader from "../stocks/loader";
import PaymentPopover from "./popover";
import useSWR from "swr";
import { getGoalsPayments } from "@/lib/goals/queries";

const generateDates = (start: Date, end: Date): Date[] => {
  const dates = [];
  let currentDate = start;
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dates;
};

const getAmountByDate = (date: string, payments: GoalPayment[]): number =>
  payments.find((p) => {
    console.log(p.date, date);
    return p.date === date;
  })?.amount || 0;

const today = new Date();

export default function GoalsTable({ goals }: { goals: Goal[] }) {
  // const {
  //   data: payments,
  //   isLoading,
  //   isValidating,
  // } = useSWR("goals_payments", getGoalsPayments, { keepPreviousData: true });
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const tbodyRef = useRef<HTMLDivElement | null>(null);

  const dates = useMemo(() => {
    const startDate = subDays(today, 21);
    return generateDates(startDate, today);
  }, []);

  // Helper function to get payment amount for a specific date and goal

  const sums = useMemo(
    () =>
      goals.reduce(
        (prev, { payments, id }) => ({
          ...prev,
          [id]: payments.reduce((prev, { amount }) => prev + amount, 0),
        }),
        {} as Record<string, number>
      ),
    [goals]
  );

  useEffect(() => {
    if (!tbodyRef.current) return;
    tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;
  }, [goals]);

  useEffect(() => {
    if (!tbodyRef.current) return;
    setScrollButtonVisible(
      tbodyRef.current.scrollTop + tbodyRef.current.clientHeight <
        tbodyRef.current.scrollHeight - 1
    );
    const onScroll = (_e: Event) => {
      if (!tbodyRef.current) return;
      setScrollButtonVisible(
        tbodyRef.current.scrollTop + tbodyRef.current.clientHeight <
          tbodyRef.current.scrollHeight - 65
      );
    };
    tbodyRef.current.addEventListener("scroll", onScroll);
    return () => {
      tbodyRef.current &&
        tbodyRef.current.removeEventListener("scroll", onScroll);
    };
  }, [tbodyRef.current]);

  // if (isLoading && !isValidating) {
  //   return <Loader title="Wpłaty" className="row-span-2" />;
  // }

  return (
    <Block title="Wpłaty" className="row-span-2">
      <ScrollShadow
        orientation="horizontal"
        hideScrollBar
        className="relative max-w-[calc(100vw-48px)]"
      >
        {scrollButtonVisible && (
          <div className="absolute bottom-24 left-[calc(50%-41px)] z-20">
            <Button
              size="sm"
              radius="md"
              disableRipple
              variant="shadow"
              className="fixed border border-primary/10"
              onClick={() => {
                tbodyRef.current?.scrollTo({
                  top: tbodyRef.current.scrollHeight,
                  behavior: "smooth",
                });
              }}
            >
              <ChevronDown size={16} /> Dzisiaj
            </Button>
          </div>
        )}
        <Table
          color="primary"
          aria-label="Goals table"
          radius="md"
          isHeaderSticky
          removeWrapper
          classNames={{
            base: "max-h-[400px] sm:max-h-[calc(100vh-262px)] scrollbar-hide py-px px-px overflow-y-scroll overflow-x-hidden min-w-max relative",
            table: "min-h-[400px]",
            thead: "[&>tr]:first:!shadow-none",
          }}
          baseRef={tbodyRef}
          shadow="none"
        >
          <TableHeader>
            <TableColumn className="font-medium text-sm text-foreground-700 shadow-[0_0_0_1px_rgba(23,121,129,0.1)]">
              Data
            </TableColumn>
            {
              goals.map(({ id, title }) => (
                <TableColumn
                  minWidth={288}
                  align="center"
                  className="font-medium text-sm text-foreground-700 shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)]"
                  key={id}
                >
                  {title}
                </TableColumn>
              )) as any
            }
          </TableHeader>
          <TableBody className="py-px">
            {
              dates.map((date) => {
                const YMD = format(date, "yyyy-MM-dd");
                const isToday = today.toDateString() === date.toDateString();
                return (
                  <TableRow
                    className={cn(!isToday && "hover:bg-light")}
                    key={date.toISOString()}
                  >
                    <TableCell
                      className={cn(
                        "min-w-max",
                        isToday ? "font-medium" : "font-normal"
                      )}
                    >
                      {isToday
                        ? "Dzisiaj"
                        : new Intl.DateTimeFormat("pl-PL", {
                            dateStyle: "long",
                          }).format(date)}
                    </TableCell>
                    {
                      goals.map((goal) => (
                        <TableCell key={goal.id}>
                          {isToday ? (
                            <PaymentPopover
                              goal={goal}
                              amount={getAmountByDate(YMD, goal.payments)}
                              max={
                                goal.price -
                                ((sums[goal.id] || 0) -
                                  (isToday
                                    ? getAmountByDate(YMD, goal.payments)
                                    : 0))
                              }
                            />
                          ) : (
                            numberFormat(
                              goal.currency,
                              getAmountByDate(YMD, goal.payments)
                            )
                          )}
                        </TableCell>
                      )) as any
                    }
                  </TableRow>
                );
              }) as any
            }
            <TableRow className="sticky z-10" style={{ insetBlockEnd: 0 }}>
              <TableCell className="text-sm font-medium rounded-l-md shadow-[0_0_0_1px_rgba(23,121,129,0.1)] bg-light">
                Suma
              </TableCell>
              {
                goals.map(({ id, currency, price }) => (
                  <TableCell className="text-foreground-700 bg-light shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:rounded-r-md">
                    <span className="font-semibold text-sm">
                      {numberFormat(currency, sums[id] || 0)}
                    </span>{" "}
                    <span className="font-medium text-tiny">
                      / {numberFormat(currency, price)}
                    </span>
                  </TableCell>
                )) as any
              }
            </TableRow>
          </TableBody>
        </Table>
      </ScrollShadow>
    </Block>
  );
}
