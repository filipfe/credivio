"use client";

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import numberFormat from "@/utils/formatters/currency";
import { ChevronDown } from "lucide-react";
import formatAmount from "@/utils/operation/format-amount";

const payments = [
  {
    date: "2024-06-29",
    amount: 25.13,
    goal_id: "5866b78e-de6c-4fda-8210-1b45fd963cba",
  },
  {
    date: "2024-06-30",
    amount: 20.47,
    goal_id: "5866b78e-de6c-4fda-8210-1b45fd963cba",
  },
  {
    date: "2024-07-01",
    amount: 27.35,
    goal_id: "5866b78e-de6c-4fda-8210-1b45fd963cba",
  },
  {
    date: "2024-07-02",
    amount: 23.56,
    goal_id: "5b900d5c-d239-485b-acfb-ed7d091652c9",
  },
  {
    date: "2024-07-03",
    amount: 26.78,
    goal_id: "5866b78e-de6c-4fda-8210-1b45fd963cba",
  },
  {
    date: "2024-07-04",
    amount: 29.49,
    goal_id: "5866b78e-de6c-4fda-8210-1b45fd963cba",
  },
  {
    date: "2024-07-05",
    amount: 28.33,
    goal_id: "5b900d5c-d239-485b-acfb-ed7d091652c9",
  },
  {
    date: "2024-07-06",
    amount: 24.67,
    goal_id: "5b900d5c-d239-485b-acfb-ed7d091652c9",
  },
  {
    date: "2024-07-07",
    amount: 27.99,
    goal_id: "5866b78e-de6c-4fda-8210-1b45fd963cba",
  },
  {
    date: "2024-07-08",
    amount: 25.56,
    goal_id: "5b900d5c-d239-485b-acfb-ed7d091652c9",
  },
  {
    date: "2024-07-09",
    amount: 29.42,
    goal_id: "5866b78e-de6c-4fda-8210-1b45fd963cba",
  },
  {
    date: "2024-07-10",
    amount: 21.78,
    goal_id: "5b900d5c-d239-485b-acfb-ed7d091652c9",
  },
  {
    date: "2024-07-12",
    amount: 19.99,
    goal_id: "7006a6f3-d566-4ac4-9869-a811a93f5a80",
  },
  {
    date: "2024-07-14",
    amount: 31.14,
    goal_id: "7006a6f3-d566-4ac4-9869-a811a93f5a80",
  },
  {
    date: "2024-07-15",
    amount: 28.9,
    goal_id: "5b900d5c-d239-485b-acfb-ed7d091652c9",
  },
  {
    date: "2024-07-18",
    amount: 22.56,
    goal_id: "7006a6f3-d566-4ac4-9869-a811a93f5a80",
  },
  {
    date: "2024-07-20",
    amount: 24.75,
    goal_id: "7006a6f3-d566-4ac4-9869-a811a93f5a80",
  },
  {
    date: "2024-07-22",
    amount: 26.5,
    goal_id: "7006a6f3-d566-4ac4-9869-a811a93f5a80",
  },
  {
    date: "2024-07-24",
    amount: 29.88,
    goal_id: "7006a6f3-d566-4ac4-9869-a811a93f5a80",
  },
  {
    date: "2024-07-27",
    amount: 28.0,
    goal_id: "7006a6f3-d566-4ac4-9869-a811a93f5a80",
  },
];

const sums = payments.reduce(
  (prev, { goal_id, amount }) => ({
    ...prev,
    [goal_id]: (prev[goal_id] || 0) + amount,
  }),
  {} as Record<string, number>
);

const generateDates = (start: Date, end: Date): Date[] => {
  const dates = [];
  let currentDate = start;
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dates;
};

const today = new Date();

export default function GoalsTable({ goals }: { goals: Goal[] }) {
  console.log(goals);
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const tbodyRef = useRef<HTMLDivElement | null>(null);

  const dates = useMemo(() => {
    const startDate = subDays(today, 21);
    return generateDates(startDate, today);
  }, []);

  // Helper function to get payment amount for a specific date and goal
  const getPaymentAmount = useCallback(
    (date: string, goal_id: string): number => {
      const payment = payments.find(
        (p) => p.date === date && p.goal_id === goal_id
      );
      return payment ? payment.amount : 0;
    },
    [payments]
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

  return (
    <Block title="Wpłaty" className="row-span-2">
      <ScrollShadow orientation="horizontal" hideScrollBar className="relative">
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
                      {isToday ? "Dzisiaj" : YMD}
                    </TableCell>
                    {
                      goals.map((goal) => (
                        <TableCell key={goal.id}>
                          {isToday ? (
                            <Popover placement="top">
                              <PopoverTrigger>
                                <button className="w-full bg-light border-primary/10 border rounded-md px-4 py-2">
                                  {numberFormat(
                                    goal.currency,
                                    getPaymentAmount(YMD, goal.id)
                                  )}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="py-2">
                                <AmountInput
                                  max={
                                    goal.price -
                                    ((sums[goal.id] || 0) -
                                      (isToday
                                        ? getPaymentAmount(YMD, goal.id)
                                        : 0))
                                  }
                                  defaultAmount={getPaymentAmount(YMD, goal.id)}
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            numberFormat(
                              goal.currency,
                              getPaymentAmount(YMD, goal.id)
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

const AmountInput = ({
  defaultAmount,
  max,
}: {
  defaultAmount: number;
  max: number;
}) => {
  const [amount, setAmount] = useState(defaultAmount.toString());

  return (
    <div className="flex items-center relative">
      <Input
        autoFocus
        label="Kwota"
        isInvalid={parseFloat(amount) > max}
        classNames={{
          inputWrapper: "!outline-none",
        }}
        value={amount}
        onValueChange={(value) => setAmount(formatAmount(value))}
      />
      <Button
        size="sm"
        radius="md"
        isIconOnly
        disableRipple
        className="border border-primary/10 bg-white absolute right-2 min-w-12 z-10"
        onClick={() => setAmount(max.toString())}
      >
        100%
      </Button>
    </div>
  );
};
