"use client";

import { Spinner } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useCallback } from "react";
import Empty from "../ui/empty";

type Props = {
  stocks: TableStock[];
  simplified?: boolean;
  quantityVisible?: boolean;
};

const columns = ({
  quantityVisible,
  simplified,
}: Pick<Props, "quantityVisible" | "simplified">) => [
  { key: "_symbol", label: "INSTRUMENT" },
  { key: "_change", label: "ZMIANA" },
  ...(simplified
    ? []
    : [
        { key: "_bid_size", label: "SPRZEDAŻ" },
        { key: "_ask_size", label: "KUPNO" },
      ]),
  { key: "_quote", label: "KURS" },
  ...(quantityVisible ? [{ key: "quantity", label: "ILOŚĆ" }] : []),
];

type TableStock = Stock & { quantity?: number };

export default function StockTable({
  stocks,
  quantityVisible,
  simplified,
}: Props) {
  const renderCell = useCallback(
    (stock: TableStock, columnKey: keyof TableStock) => {
      const cellValue = stock[columnKey];

      switch (columnKey) {
        case "_change":
          const isUp =
            cellValue?.toString().startsWith("+") &&
            !cellValue?.toString().endsWith("0.00");
          const isDown = cellValue?.toString().startsWith("-");
          return (
            <div
              className={`flex items-center gap-2 ${
                isUp ? "text-success" : isDown ? "text-danger" : "text-font/70"
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
    },
    []
  );
  return (
    <Table
      removeWrapper
      shadow="none"
      color="primary"
      className="max-w-full w-full flex-1"
    >
      <TableHeader>
        {columns({ quantityVisible, simplified }).map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={stocks}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={
          <div className="text-center flex-1 justify-center flex flex-col items-center gap-3">
            <Empty
              title="Nie masz jeszcze żadnych akcji!"
              cta={{
                title: "Dodaj transkację",
                href: "/stocks/transactions/add",
              }}
            />
          </div>
        }
      >
        {(item) => (
          <TableRow key={item._symbol} className="hover:bg-light">
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof TableStock)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
