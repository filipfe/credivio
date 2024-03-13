"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Add from "./cta/add";
import Delete from "./cta/delete";
import Edit from "./cta/edit";

const columns = [
  { key: "issued_at", label: "DATA" },
  { key: "title", label: "TYTUŁ" },
  { key: "description", label: "OPIS" },
  { key: "amount", label: "KWOTA" },
  { key: "currency", label: "WALUTA" },
  // { key: "budget_after", label: "BUDGET AFTER" },
];

type Props = {
  operations: Operation[];
  count: number;
  viewOnly?: boolean;
  type?: "expense" | "income";
  title?: string;
  children?: React.ReactNode;
};

type SearchQuery = {
  page: number;
  sort?: string;
};

export default function OperationTable({
  operations,
  count,
  viewOnly,
  type,
  title,
  children,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<Operation[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<any> | "all">(
    new Set([])
  );
  const pages = Math.ceil(count / 10);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    page: 1,
  });

  useEffect(() => {
    setIsLoading(false);
    if (!viewOnly) return;
    const start = (searchQuery.page - 1) * 10;
    const end = start + 10;
    return setItems(operations.slice(start, end));
  }, [operations]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    Object.keys(searchQuery).map((key: string) => {
      searchParams.set(
        key,
        String(searchQuery[key as keyof typeof searchQuery])
      );
    });
    router.push(`${pathname}?${searchParams.toString()}`);
  }, [searchQuery]);

  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    if (viewOnly) {
      switch (columnKey) {
        case "title":
          return (
            <span className="line-clamp-1 break-all xl:max-w-[5vw]">
              {cellValue}
            </span>
          );
        case "description":
          return (
            <span className="line-clamp-1 break-all xl:max-w-[10vw]">
              {cellValue}
            </span>
          );
        case "issued_at":
          return (
            <span className="line-clamp-1 break-all w-[10ch]">{cellValue}</span>
          );
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    } else {
      switch (columnKey) {
        case "issued_at":
          return (
            <span className="line-clamp-1 break-all w-[10ch]">{cellValue}</span>
          );
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    }
  }, []);

  return (
    <div className="bg-white rounded-lg py-8 px-10 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-lg">{title}</h1>
        <div className="flex items-center gap-1.5">
          {type && (selectedKeys === "all" || selectedKeys.size > 0) && (
            <Delete items={selectedKeys} count={count} type={type} />
          )}
          {type && (selectedKeys === "all" || selectedKeys.size > 0) && (
            <Edit
              type={type}
              id={Array.from(selectedKeys)[0]}
              isDisabled={selectedKeys === "all" || selectedKeys.size > 1}
            />
          )}
          {type && operations.length > 0 && <Add type={type} />}
        </div>
      </div>
      <Table
        shadow="none"
        color="primary"
        selectionMode={"multiple"}
        sortDescriptor={{
          column: searchQuery.sort?.startsWith("-")
            ? searchQuery.sort.slice(1)
            : searchQuery.sort,
          direction: searchQuery.sort?.startsWith("-")
            ? "descending"
            : "ascending",
        }}
        onSortChange={({ direction, column }: SortDescriptor) => {
          setIsLoading(true);
          setSearchQuery({
            page: 1,
            sort: `${direction === "descending" ? "-" : ""}${column}`,
          });
        }}
        // bottomContent={count > 0 && bottomContent}
        bottomContentPlacement="outside"
        aria-label="Example static collection table"
        className={`max-w-full w-full flex-1`}
        checkboxesProps={{
          classNames: {
            wrapper: "text-background",
          },
        }}
        classNames={{
          wrapper: "p-0",
        }}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={count > 0 && !viewOnly ? true : undefined}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          emptyContent={"No rows found"}
          items={viewOnly ? items : operations}
          loadingContent={<Spinner />}
        >
          {(viewOnly ? items : operations).map((operation, i) => (
            <TableRow
              key={operation.id || `operation:${i}:${searchQuery.page}`}
            >
              {(columnKey) => (
                <TableCell>{renderCell(operation, columnKey)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div
        className={`py-2 px-2 flex ${
          viewOnly ? "justify-end" : "justify-between"
        } items-start`}
      >
        {!viewOnly && (
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${count} selected`}
          </span>
        )}
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          className="text-background"
          page={searchQuery.page}
          isDisabled={isLoading}
          total={pages}
          onChange={(page: number) => {
            setIsLoading(true);
            setSearchQuery((prev) => ({ ...prev, page }));
          }}
        />
      </div>
      {children}
    </div>
  );
}
