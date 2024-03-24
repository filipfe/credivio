"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import Add from "../general/cta/add";
import Delete from "../general/cta/delete";
import Edit from "../general/cta/edit";
import useTableQuery from "@/hooks/useTableQuery";

type Props = {
  operations: Operation[];
  count: number;
  type?: "expense" | "income";
  title?: string;
  children?: React.ReactNode;
  setOperations?: Dispatch<SetStateAction<Operation[]>>;
};

export default function OperationTable({
  operations,
  count,
  type,
  title,
  setOperations,
  children,
}: Props) {
  const viewOnly = !!setOperations;
  const [selectedKeys, setSelectedKeys] = useState<Set<any> | "all">(
    new Set([])
  );
  const pages = Math.ceil(count / 10);
  const { items, isLoading, setIsLoading, searchQuery, setSearchQuery } =
    useTableQuery(operations, viewOnly);
  const { page, sort } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [operations]);

  const bottomContent = useMemo(() => {
    return (
      <div
        className={`py-2 px-2 flex ${
          viewOnly ? "justify-end" : "justify-between"
        } items-start`}
      >
        {!viewOnly && (
          <span className="text-small text-default-400">
            {selectedKeys === "all" || selectedKeys.size === count
              ? "Wszystkie elementy wybrane"
              : `${selectedKeys.size} z ${count} wybranych`}
          </span>
        )}
        <Pagination
          isCompact
          showControls
          color="primary"
          className="text-background"
          page={page}
          isDisabled={isLoading}
          total={pages}
          onChange={(page: number) => {
            !viewOnly && setIsLoading(true);
            setSearchQuery((prev) => ({ ...prev, page }));
          }}
        />
      </div>
    );
  }, [operations, page, pages, selectedKeys, isLoading]);

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
          {(selectedKeys === "all" || selectedKeys.size > 0) && (
            <Delete
              items={selectedKeys}
              count={count}
              type={type}
              viewOnly={viewOnly}
              callback={() => {
                if (viewOnly) {
                  const keys: string[] =
                    selectedKeys === "all"
                      ? []
                      : Array.from(selectedKeys.values());
                  const toDelete: number[] = keys.reduce((prev, curr) => {
                    const [_, index, page] = curr.split(":");
                    const id = (parseInt(page) - 1) * 10 + parseInt(index);
                    return [...prev, id];
                  }, [] as number[]);
                  setOperations((prev) =>
                    selectedKeys === "all"
                      ? []
                      : prev.filter((_, i) => !toDelete.includes(i))
                  );
                  setSearchQuery((prev) => ({ ...prev, page: 1 }));
                }
                setSelectedKeys(new Set([]));
              }}
            />
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
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          {columns(operations.some((item) => item.label)).map((column) => (
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
          emptyContent="Nie znaleziono operacji"
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
      {children}
    </div>
  );
}
