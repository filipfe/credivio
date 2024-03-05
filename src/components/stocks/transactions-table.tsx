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
import Add from "../operation/add";

const columns = [
  { key: "issued_at", label: "DATA ZAWARCIA" },
  { key: "symbol", label: "INSTRUMENT" },
  { key: "transaction_type", label: "TYP TRANSAKCJI" },
  { key: "quantity", label: "ILOŚĆ" },
  { key: "price", label: "CENA" },
  { key: "value", label: "WARTOŚĆ" },
  { key: "currency", label: "WALUTA" },
  { key: "commission", label: "PROWIZJA" },
];

export default function TransactionTable({
  stocks,
}: {
  stocks: StockTransaction[];
}) {
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
          <TableColumn key={column.key} allowsSorting>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={stocks}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={
          <div className="text-center flex-1 justify-center flex flex-col items-center gap-4">
            <p>Nie masz jeszcze żadnych akcji!</p>
            <Add type="stock" />
          </div>
        }
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
