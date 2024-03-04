"use client";

import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const columns = [
  { key: "issued_at", label: "DATA" },
  { key: "title", label: "TYTUŁ" },
  { key: "amount", label: "KWOTA" },
  { key: "description", label: "OPIS" },
  { key: "currency", label: "WALUTA" },
  // { key: "budget_after", label: "BUDGET AFTER" },
];

type Props = {
  operations: Operation[];
  count: number;
};

export default function IncomeTable({ operations, count }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedKeys, setSelectedKeys] = React.useState<Set<any> | "all">(
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
      <div className="py-2 px-2 flex justify-between items-start">
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
  }, [operations.length, page, pages, selectedKeys]);

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
        items={operations}
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
