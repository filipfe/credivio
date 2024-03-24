"use client";

import { useCallback, useEffect, useMemo } from "react";
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
import Add from "../ui/cta/add";
import useTableQuery from "@/hooks/useTableQuery";

export default function OperationTable({
  rows,
  count,
  type,
  title,
  viewOnly,
  children,
}: TableProps<Operation> & { type?: OperationType }) {
  const pages = Math.ceil(count / 10);
  const {
    items,
    setItems,
    isLoading,
    setIsLoading,
    searchQuery,
    setSearchQuery,
  } = useTableQuery(rows, !!viewOnly);
  const { page, sort } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [rows]);

  const bottomContent = useMemo(() => {
    return (
      <Pagination
        isCompact
        showControls
        color="primary"
        className="text-background mt-2 ml-auto mr-2"
        page={page}
        isDisabled={isLoading}
        total={pages}
        onChange={(page: number) => {
          !viewOnly && setIsLoading(true);
          setSearchQuery((prev) => ({ ...prev, page }));
        }}
      />
    );
  }, [rows, page, pages, isLoading]);

  const columns = useCallback(
    (hasLabel: boolean) => [
      { key: "issued_at", label: "DATA" },
      { key: "title", label: "TYTUŁ" },
      { key: "description", label: "OPIS" },
      { key: "amount", label: "KWOTA" },
      { key: "currency", label: "WALUTA" },
      ...(hasLabel ? [{ key: "label", label: "ETYKIETA" }] : []),
    ],
    [page]
  );

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
        case "label":
          return cellValue?.title || "-";
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    }
  }, []);

  return (
    <div className="bg-white rounded-lg py-8 px-10 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 h-10">
        <h1 className="text-lg">{title}</h1>
        <div className="flex items-center gap-1.5">
          {type && rows.length > 0 && <Add type={type} />}
        </div>
      </div>
      <Table
        shadow="none"
        color="primary"
        sortDescriptor={{
          column: sort?.includes("-") ? sort?.split("-")[1] : sort?.toString(),
          direction: sort?.includes("-") ? "descending" : "ascending",
        }}
        onSortChange={(descriptor: SortDescriptor) => {
          !viewOnly && setIsLoading(true);
          setSearchQuery({
            page: 1,
            sort:
              (descriptor.direction === "descending" ? "-" : "") +
              descriptor.column,
          });
        }}
        bottomContent={count > 0 && bottomContent}
        bottomContentPlacement="outside"
        aria-label="operations-table"
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
          {columns(rows.some((item) => item.label)).map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={count > 0 && !viewOnly ? true : undefined}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={viewOnly ? items : rows}
          isLoading={isLoading}
          emptyContent="Nie znaleziono operacji"
          loadingContent={<Spinner />}
        >
          {(operation) => (
            <TableRow key={operation.id}>
              {(columnKey) => (
                <TableCell>{renderCell(operation, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {children}
    </div>
  );
}
