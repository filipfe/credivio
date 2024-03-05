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
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useCallback } from "react";

const columns = [
  { key: "symbol", label: "INSTRUMENT" },
  { key: "change", label: "ZMIANA" },
  { key: "bid_size", label: "SPRZEDAŻ" },
  { key: "ask_size", label: "KUPNO" },
  { key: "quote", label: "KURS" },
];

export default function StockTable({ stocks }: { stocks: Stock[] }) {
  const renderCell = useCallback((stock: Stock, columnKey: keyof Stock) => {
    const cellValue = stock[columnKey];

    switch (columnKey) {
      case "_change":
        const isUp = cellValue?.toString().startsWith("+");
        const isDown = cellValue?.toString().startsWith("-");
        return (
          <div
            className={`flex items-center gap-2 ${
              isUp ? "text-success" : isDown ? "text-danger" : ""
            }`}
          >
            {isUp ? (
              <TrendingUpIcon size={16} />
            ) : isDown ? (
              <TrendingDownIcon size={16} />
            ) : (
              <></>
            )}
            <span className="font-medium">{cellValue}%</span>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
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
      <TableBody items={stocks} loadingContent={<Spinner label="Loading..." />}>
        {(item) => (
          <TableRow key={item._symbol}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, `_${columnKey}` as keyof Stock)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
