"use client";

import React, { useCallback, useState } from "react";
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
  incomes: Operation[];
  count: number;
};

export default function IncomeTable({ incomes, count }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<any> | "all">(
    new Set([])
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const pages = Math.ceil(count / rowsPerPage);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    sort: "",
  });

  const { page, sort } = searchQuery;

  // const onRowsPerPageChange = React.useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setRowsPerPage(Number(e.target.value));
  //     changePage(1);
  //   },
  //   []
  // );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      Object.keys(searchQuery).forEach((key) => {
        params.set(key, String(searchQuery[key as keyof typeof searchQuery]));
      });
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setSearchQuery((prev) => ({ ...prev, page }));
      router.push(
        pathname + "?" + createQueryString("page", (page + 1).toString())
      );
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setSearchQuery((prev) => ({ ...prev, page }));
      router.push(
        pathname + "?" + createQueryString("page", (page - 1).toString())
      );
    }
  }, [page]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {count}</span>
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${count} selected`}
          </span>
          {/* <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label> */}
        </div>
      </div>
    );
  }, [
    // filterValue,
    // statusFilter,
    // visibleColumns,
    // onSearchChange,
    // onRowsPerPageChange,
    count,
    selectedKeys,
    // hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          className="text-background"
          page={page}
          total={pages}
          onChange={(page: number) => {
            setSearchQuery((prev) => ({ ...prev, page }));
            router.push(
              pathname + "?" + createQueryString("page", page.toString())
            );
          }}
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
  }, [incomes.length, page, pages]);

  return (
    <Table
      shadow="none"
      color="primary"
      selectionMode="multiple"
      sortDescriptor={{
        column: sort?.includes("-") ? sort?.split("-")[1] : sort?.toString(),
        direction: sort?.includes("-") ? "descending" : "ascending",
      }}
      onSortChange={(descriptor: SortDescriptor) => {
        const value =
          (descriptor.direction === "descending" ? "-" : "") +
          descriptor.column;
        setSearchQuery((prev) => ({ ...prev, sort: value }));
        router.push(pathname + "?" + createQueryString("sort", value));
      }}
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      aria-label="Example static collection table"
      className="max-w-full w-full flex-1"
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
