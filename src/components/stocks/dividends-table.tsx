"use client";

import { Spinner } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useCallback } from "react";

type Props = {
  dividends: Dividend[];
  holdings?: Holdings;
};

type ColumnKey = keyof Dividend | "profit";

type TableDividend = Dividend & { profit?: string };

const columns: (
  profitVisible?: boolean
) => { key: ColumnKey; label: string }[] = (profitVisible) => [
  { key: "company", label: "SPÓŁKA" },
  { key: "amount", label: "WYSOKOŚĆ" },
  { key: "ratio", label: "STOPA" },
  { key: "date", label: "DZIEŃ DYWIDENDY" },
  { key: "payment_date", label: "DZIEŃ WYPŁATY" },
  { key: "for_year", label: "ZA ROK OBROTOWY" },
  ...(profitVisible
    ? [{ key: "profit" as ColumnKey, label: "TWÓJ ZYSK" }]
    : []),
];

export default function DividendsTable({ dividends, holdings }: Props) {
  const renderCell = useCallback(
    (dividend: TableDividend, columnKey: ColumnKey) => {
      const cellValue = dividend[columnKey];
      switch (columnKey) {
        case "amount":
          return `${cellValue} PLN`;
        case "ratio":
          return cellValue + "%";
        default:
          return cellValue;
      }
    },
    []
  );

  const validItems = holdings
    ? dividends.map((item) => {
        if (!holdings) return item;
        const profitFloat =
          parseFloat(item.amount) * (holdings[item.company] || 0);
        const profit = new Intl.NumberFormat("pl-PL", {
          style: "currency",
          currency: item.currency,
        }).format(profitFloat);
        return {
          ...item,
          profit,
        };
      })
    : dividends;

  console.log(validItems);

  return (
    <Table
      shadow="none"
      color="primary"
      className="max-w-full w-full flex-1 rounded-t-lg"
      classNames={{
        wrapper: "p-0",
      }}
    >
      <TableHeader>
        {columns(!!holdings).map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={validItems}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow
            key={item.company + item.date}
            className="hover:bg-[#f7f7f8]"
          >
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof Dividend)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
