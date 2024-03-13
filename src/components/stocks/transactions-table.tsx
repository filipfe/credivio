"use client";

import { Spinner } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/table";
import Add from "../operation/cta/add";
import { TRANSACTION_TYPES } from "@/const";
import { useCallback } from "react";

const columns = (viewOnly?: boolean) => [
  ...(!viewOnly ? [{ key: "issued_at", label: "DATA ZAWARCIA" }] : []),
  { key: "symbol", label: "INSTRUMENT" },
  { key: "transaction_type", label: "TYP TRANSAKCJI" },
  { key: "quantity", label: "ILOŚĆ" },
  { key: "price", label: "CENA" },
  ...(!viewOnly ? [{ key: "value", label: "WARTOŚĆ" }] : []),
  ...(!viewOnly ? [{ key: "currency", label: "WALUTA" }] : []),
  { key: "commission", label: "PROWIZJA" },
];

type Props = {
  stocks: StockTransaction[];
  count: number;
  viewOnly?: boolean;
};

export default function TransactionTable({ stocks, count, viewOnly }: Props) {
  const renderCell = useCallback(
    (stock: StockTransaction, columnKey: keyof StockTransaction) => {
      const cellValue = stock[columnKey];
      switch (columnKey) {
        case "transaction_type":
          return TRANSACTION_TYPES.find(
            (tt) => tt.value === stock.transaction_type
          )!.name;
        case "price":
          const formatter = new Intl.NumberFormat("pl-PL", {
            currency: stock.currency,
            style: "currency",
          });
          return formatter.format(parseFloat(stock.price));
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
      aria-label="transactions-table"
      selectionMode={"multiple"}
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
        {columns(viewOnly).map((column) => (
          <TableColumn
            key={column.key}
            allowsSorting={count > 0 && !viewOnly ? true : undefined}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={
          <div className="text-center flex-1 justify-center flex flex-col items-center gap-4">
            {viewOnly ? (
              <p>Dodaj akcje, aby zobaczyć je na podglądzie.</p>
            ) : (
              <>
                <p>Nie masz jeszcze żadnych akcji!</p>
                <Add type="stock" />
              </>
            )}
          </div>
        }
      >
        {stocks.map((stock, i) => (
          <TableRow key={`stock:${i}`}>
            {(columnKey) => (
              <TableCell>
                {renderCell(stock, columnKey as keyof StockTransaction)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
