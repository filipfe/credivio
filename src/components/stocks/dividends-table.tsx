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

const columns: { key: keyof Dividend; label: string }[] = [
  { key: "company", label: "SPÓŁKA" },
  { key: "amount", label: "WYSOKOŚĆ DYWIDENDY" },
  { key: "ratio", label: "STOPA DYWIDENDY" },
  { key: "date", label: "DZIEŃ DYWIDENDY" },
  { key: "payment_date", label: "DZIEŃ WYPŁATY" },
  { key: "for_year", label: "ZA ROK OBROTOWY" },
];

export default function DividendsTable({
  dividends,
}: {
  dividends: Dividend[];
}) {
  const renderCell = useCallback(
    (dividend: Dividend, columnKey: keyof Dividend) => {
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
  return (
    <Table
      shadow="none"
      color="primary"
      className="max-w-full w-full flex-1"
      checkboxesProps={{
        classNames: {
          wrapper: "text-background",
        },
      }}
      classNames={{
        wrapper: "p-0",
      }}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={dividends}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.company + item.date}>
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
