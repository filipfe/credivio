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
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import PaymentPopover from "./popover";
import NumberFormat from "@/utils/formatters/currency";

export default function GoalsTable({
  goals,
  tableData,
  language,
}: {
  goals: Goal[];
  tableData: GoalPayment[];
  language: Locale;
}) {
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const tbodyRef = useRef<HTMLDivElement | null>(null);

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
              className="fixed border"
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
            base: "max-h-[400px] sm:max-h-[calc(100vh-266px)] scrollbar-hide py-px px-px overflow-y-scroll overflow-x-hidden min-w-max relative",
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
            {goals.length > 0 &&
              (goals.map((goal) => (
                <TableColumn
                  minWidth={288}
                  align="center"
                  className="font-medium text-sm text-foreground-700 shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)]"
                  key={goal.id}
                >
                  {goal.title}
                </TableColumn>
              )) as any)}
          </TableHeader>
          <TableBody className="py-px">
            {
              tableData.map(({ date, payments }) => {
                const isToday = tableData[tableData.length - 1].date === date;
                return (
                  <TableRow
                    className={cn(!isToday && "hover:bg-light")}
                    key={date}
                  >
                    <TableCell
                      className={cn(
                        "min-w-max",
                        isToday ? "font-medium" : "font-normal"
                      )}
                    >
                      {isToday
                        ? "Dzisiaj"
                        : new Intl.DateTimeFormat(language, {
                            dateStyle: "long",
                          }).format(new Date(date))}
                    </TableCell>
                    {
                      goals.map((goal) => {
                        const payment = payments.find(
                          (p) => p.goal_id === goal.id
                        )!;

                        return (
                          <TableCell key={goal.id}>
                            {isToday ? (
                              <PaymentPopover
                                goal={goal}
                                paid={payment.amount}
                              />
                            ) : (
                              <NumberFormat
                                currency={goal.currency}
                                amount={payment.amount}
                              />
                            )}
                          </TableCell>
                        );
                      }) as any
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
                goals.map((goal) => (
                  <TableCell className="text-foreground-700 bg-light shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:rounded-r-md">
                    <span className="font-semibold text-sm">
                      <NumberFormat
                        currency={goal.currency}
                        amount={goal.total_paid}
                      />
                    </span>{" "}
                    <span className="font-medium text-tiny">
                      /{" "}
                      <NumberFormat
                        currency={goal.currency}
                        amount={goal.price}
                      />
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
