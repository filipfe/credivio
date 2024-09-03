"use client";

import numberFormat from "@/utils/formatters/currency";
import {
  Chip,
  cn,
  Pagination,
  ScrollShadow,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Table as Tbl,
} from "@nextui-org/react";
import { useCallback } from "react";
import Menu from "./menu";
import { formatDuration } from "date-fns";
import { pl } from "date-fns/locale";

const columns = [
  {
    key: "title",
    label: "Tytuł",
  },
  { key: "amount", label: "Kwota" },
  { key: "interval", label: "Interwał" },
];

type Props = {
  payments: WithId<RecurringPayment>[];
};

export default function Table({ payments }: Props) {
  const renderCell = useCallback(
    (
      item: WithId<RecurringPayment>,
      columnKey: keyof WithId<RecurringPayment> | "actions" | "interval"
    ) => {
      switch (columnKey) {
        case "type":
          return (
            <></>
            // <div
            //   className={cn(
            //     "h-2.5 w-2.5 rounded-full",
            //     // item.type === "expense" ? "bg-danger" : "bg-success"
            //     "bg-success"
            //   )}
            // />
          );
        case "amount":
          return (
            <Chip
              size="sm"
              variant="flat"
              color={item.type === "income" ? "success" : "danger"}
              classNames={{ content: "text-sm" }}
              className={cn(
                "border",
                item.type === "income"
                  ? "bg-success/10 border-success/20"
                  : "bg-danger/10 border-danger/20"
              )}
            >
              {/* <span
              className={cn(
                "font-semibold whitespace-nowrap",
                item.type === "income" ? "text-success" : "text-danger"
              )}
            > */}
              {item.type === "income" ? "+" : "-"}{" "}
              {numberFormat(item.currency, item[columnKey])}
              {/* </span> */}
            </Chip>
          );
        case "actions":
          return (
            <div className="max-w-max ml-auto">
              <Menu {...item} />
            </div>
          );
        case "interval":
          return (
            "Co " +
            formatDuration(
              {
                ...(item.interval_unit === "month"
                  ? { months: item.interval_amount }
                  : {}),
                ...(item.interval_unit === "day"
                  ? { days: item.interval_amount }
                  : {}),
                ...(item.interval_unit === "week"
                  ? { weeks: item.interval_amount }
                  : {}),
              },
              { locale: pl }
            )
          );
        default:
          return item[columnKey];
      }
    },
    []
  );

  return (
    <div className="flex flex-col justify-between gap-2.5 flex-1">
      <ScrollShadow
        hideScrollBar
        orientation="horizontal"
        className="max-w-[calc(100vw-48px)] sm:max-h-[calc(100vh-558px)]"
      >
        <Tbl hideHeader removeWrapper>
          <TableHeader
            columns={[
              // { key: "type", label: "" },
              ...columns,
              { key: "actions", label: "" },
            ]}
          >
            {(column) => (
              <TableColumn className="uppercase" key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={payments}>
            {(payment) => (
              <TableRow className="[&:hover>td]:bg-light">
                {(columnKey) => (
                  <TableCell
                    className={cn(
                      "whitespace-nowrap",
                      columnKey === "type" && "w-2.5"
                    )}
                  >
                    {renderCell(
                      payment,
                      columnKey as keyof WithId<RecurringPayment>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Tbl>
      </ScrollShadow>
      <Pagination
        size="sm"
        isCompact
        showControls
        showShadow={false}
        color="primary"
        className="text-background"
        classNames={{
          wrapper: "!shadow-none border ml-auto",
        }}
        page={1}
        // isDisabled={isLoading}
        total={2}
        onChange={(page) => {}}
      />
    </div>
  );
}
