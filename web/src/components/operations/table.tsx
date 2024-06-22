"use client";

import { useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  ScrollShadow,
} from "@nextui-org/react";
import useTableQuery from "@/hooks/useTableQuery";
import TopContent from "../ui/table/top-content";
import Block from "../ui/block";
import Empty from "../ui/empty";
import useSelection from "@/hooks/useSelection";

export default function OperationTable({
  rows,
  count,
  viewOnly,
  children,
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
    handleCurrencyChange,
  } = useTableQuery(rows, !!viewOnly);
  const {
    selectionMode,
    selectedKeys,
    onSelectionChange,
    onRowAction,
    setSelectedKeys,
  } = useSelection((viewOnly ? items : rows).map((item) => item.id));
  const { page, sort, search, label: _label } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [rows]);

  const columns = useCallback(
    (hasLabel: boolean) => [
      { key: "issued_at", label: "DATA" },
      { key: "title", label: "TYTUŁ" },
      ...(items.some((item) => item.description)
        ? [{ key: "description", label: "OPIS" }]
        : []),
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
            <span className="line-clamp-1 break-all w-[10ch]">
              {new Intl.DateTimeFormat("pl-PL", {
                dateStyle: "short",
              }).format(new Date(cellValue))}
            </span>
          );
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    } else {
      switch (columnKey) {
        case "issued_at":
          return (
            <span className="line-clamp-1 break-all w-[10ch]">
              {new Intl.DateTimeFormat("pl-PL", {
                dateStyle: "short",
              }).format(new Date(cellValue))}
            </span>
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
    <Block
      title={props.title}
      className="w-screen sm:w-full"
      hideTitleMobile
      cta={
        <TopContent
          {...props}
          selected={selectedKeys}
          handleSearch={handleSearch}
          deletionCallback={() => setSelectedKeys([])}
          search={search}
          addHref={`/${props.type}s/add`}
          state={{
            label: {
              value: searchQuery.label,
              onChange: handleLabelChange,
            },
            currency: {
              value: searchQuery.currency,
              onChange: handleCurrencyChange,
            },
          }}
        />
      }
    >
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          removeWrapper
          shadow="none"
          color="primary"
          sortDescriptor={{
            column: sort?.includes("-")
              ? sort?.split("-")[1]
              : sort?.toString(),
            direction: sort?.includes("-") ? "descending" : "ascending",
          }}
          onSortChange={handleSort}
          topContentPlacement="outside"
          bottomContentPlacement="outside"
          aria-label="operations-table"
          className="max-w-full w-full flex-1"
          selectionMode={selectionMode}
          checkboxesProps={{
            classNames: {
              wrapper: "text-background",
            },
          }}
          selectedKeys={
            (viewOnly ? items : rows).every((item) =>
              selectedKeys.includes(item.id)
            )
              ? "all"
              : new Set(selectedKeys)
          }
          onSelectionChange={onSelectionChange}
          onRowAction={(key) => onRowAction(key.toString())}
          classNames={{
            tr: "cursor-pointer",
            td: "[&_span:last-child]:before:!border-neutral-200",
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
            emptyContent={
              <Empty
                title="Nie znaleziono operacji"
                cta={
                  viewOnly
                    ? undefined
                    : {
                        title: `Dodaj ${
                          props.type === "expense" ? "wydatek" : "przychód"
                        }`,
                        href: `/${props.type}s/add`,
                      }
                }
              />
            }
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
      </ScrollShadow>
      {count > 0 && (
        <div className="mt-2 flex-1 flex items-end justify-end">
          <Pagination
            size="sm"
            isCompact
            showControls
            showShadow={false}
            color="primary"
            className="text-background"
            classNames={{
              wrapper: "!shadow-none",
            }}
            page={page}
            isDisabled={isLoading}
            total={pages}
            onChange={handlePageChange}
          />
        </div>
      )}
      {children}
    </Block>
  );
}
