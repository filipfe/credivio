"use client";

import { useAsyncList } from "@react-stately/data";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import React from "react";
import { Spinner, Pagination, Button } from "@nextui-org/react";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
}

const today = new Date();
const formattedDate = formatDate(today);
let i = 1;
const generateRandomRow = () => {
  const issuedAt = formattedDate;
  const title = `Sample Title ${Math.floor(Math.random() * 1000)}`;
  const amount = (Math.random() * 1000).toFixed(2);
  const description = "Sample Description";
  const currency = ["USD", "EUR", "GBP"][Math.floor(Math.random() * 3)];
  const currencyDate = formattedDate;
  const budgetAfter = (Math.random() * 5000).toFixed(2);

  return {
    key: i++,
    issued_at: issuedAt,
    title: title,
    amount: amount,
    description: description,
    currency: currency,
    currency_date: currencyDate,
    budget_after: budgetAfter,
  };
};

const rows = new Array(10).fill(null).map(() => generateRandomRow());

const columns = [
  { key: "issued_at", label: "ISSUED AT" },
  { key: "title", label: "TITLE" },
  { key: "amount", label: "AMOUNT" },
  { key: "description", label: "DESCRIPTION" },
  { key: "currency", label: "CURRENCY" },
  { key: "currency_date", label: "CURRENCY DATE" },
  { key: "budget_after", label: "BUDGET AFTER" },
];

interface MyListItem {
  key: number;
  issued_at: string;
  title: string;
  amount: string;
  description: string;
  currency: string;
  currency_date: string;
  budget_after: string;
}

export default function IncomeTable() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const pages = Math.ceil(rows.length / rowsPerPage);

  let list = useAsyncList<MyListItem>({
    initialItems: rows.map((row) => ({ ...row })),
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  //   const items = React.useMemo(() => {
  //     const start = (page - 1) * rowsPerPage;
  //     const end = start + rowsPerPage;

  //     return list.items.slice(start, end);
  //   }, [page, list.items, rowsPerPage]);

  //   console.log(items);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [rows.length, page, pages]);

  return (
    <Table
      color="primary"
      selectionMode="multiple"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      aria-label="Example static collection table"
      className="mt-8 max-w-full w-full flex-1"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-primary after:text-background text-background",
        },
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
        emptyContent={"No rows found"}
        items={list.items}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item: any) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
