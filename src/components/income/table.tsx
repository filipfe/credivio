"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  SortDescriptor,
  Spinner,
  Pagination,
  Button,
  Key,
} from "@nextui-org/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const columns = [
  { key: "issued_at", label: "ISSUED AT" },
  { key: "title", label: "TITLE" },
  { key: "amount", label: "AMOUNT" },
  { key: "description", label: "DESCRIPTION" },
  { key: "currency", label: "CURRENCY" },
  { key: "currency_date", label: "CURRENCY DATE" },
  { key: "budget_after", label: "BUDGET AFTER" },
];

type Props = {
  incomes: Income[];
  count: number;
};

export default function IncomeTable({ incomes, count }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<Key> | "all">(
    new Set([])
  );
  const pages = Math.ceil(count / 10);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    sort: "",
  });
  const { page, sort } = searchQuery;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    sort && params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
  }, [searchQuery]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${count} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          className="text-background"
          page={page}
          total={pages}
          onChange={(page: number) =>
            setSearchQuery((prev) => ({ ...prev, page }))
          }
        />
      </div>
    );
  }, [incomes.length, page, pages, selectedKeys]);

  return (
    <Table
      shadow="none"
      color="primary"
      selectionMode="multiple"
      sortDescriptor={{
        column: sort?.includes("-") ? sort?.split("-")[1] : sort?.toString(),
        direction: sort?.includes("-") ? "descending" : "ascending",
      }}
      onSortChange={(descriptor: SortDescriptor) =>
        setSearchQuery({
          page: 1,
          sort:
            (descriptor.direction === "descending" ? "-" : "") +
            descriptor.column,
        })
      }
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      aria-label="Example static collection table"
      className="mt-8 max-w-full w-full flex-1"
      checkboxesProps={{
        classNames: {
          wrapper: "text-background",
        },
      }}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
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
        items={incomes}
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
