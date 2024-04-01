"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import useTableQuery from "@/hooks/useTableQuery";
import TopContent from "../ui/table/top-content";

export default function OperationTable({
  rows,
  count,
  viewOnly,
  children,
  labels,
  ...props
}: TableProps<Operation>) {
  const pages = Math.ceil(count / 10);
  const {
    items,
    isLoading,
    setIsLoading,
    searchQuery,
    handleSearch,
    handleSort,
    handlePageChange,
    handleLabelChange,
  } = useTableQuery(rows, !!viewOnly);
  const { page, sort, search, label } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [rows]);

  const bottomContent = useMemo(
    () => (
      <Pagination
        isCompact
        showControls
        color="primary"
        className="text-background mt-2 ml-auto mr-2"
        page={page}
        isDisabled={isLoading}
        total={pages}
        onChange={handlePageChange}
      />
    ),
    [rows, page, pages, isLoading]
  );

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
        case "description":
          return cellValue || "-";
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    }
  }, []);

  return (
    <div className="bg-white rounded-lg py-8 px-10 flex flex-col gap-4">
      <Table
        shadow="none"
        color="primary"
        sortDescriptor={{
          column: sort?.includes("-") ? sort?.split("-")[1] : sort?.toString(),
          direction: sort?.includes("-") ? "descending" : "ascending",
        }}
        onSortChange={handleSort}
        topContent={
          <TopContent
            {...props}
            rows={rows}
            handleSearch={handleSearch}
            search={search}
            labels={labels}
            handleLabelChange={handleLabelChange}
            label={label}
          />
        }
        topContentPlacement="outside"
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
            <TableRow key={operation.id} className="hover:bg-[#f7f7f8]">
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
