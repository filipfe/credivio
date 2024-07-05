"use client";

import { Pagination, ScrollShadow, Spinner } from "@nextui-org/react";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { TRANSACTION_TYPES } from "@/const";
import { useCallback, useEffect } from "react";
import useTableQuery from "@/hooks/useTableQuery";
import TopContent from "../ui/table/top-content";
import Block from "../ui/block";
import numberFormat from "@/utils/formatters/currency";
import Empty from "../ui/empty";

const columns = ({
  viewOnly,
  simplified,
}: {
  viewOnly: boolean;
  simplified?: boolean;
}) => [
  ...(!viewOnly && !simplified
    ? [{ key: "issued_at", label: "DATA ZAWARCIA" }]
    : []),
  { key: "symbol", label: "INSTRUMENT" },
  { key: "transaction_type", label: "TRANSAKCJA" },
  { key: "quantity", label: "ILOŚĆ" },
  { key: "price", label: "CENA" },
  ...(!viewOnly && !simplified ? [{ key: "value", label: "WARTOŚĆ" }] : []),
  ...(!viewOnly && !simplified ? [{ key: "currency", label: "WALUTA" }] : []),
  ...(!simplified ? [{ key: "commission", label: "PROWIZJA" }] : []),
];

export default function TransactionTable({
  rows,
  count,
  simplified,
  viewOnly,
  title,
  children,
  topContent,
}: TableProps<StockTransaction>) {
  const pages = Math.ceil(count / 10);
  const {
    items,
    isLoading,
    setIsLoading,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleCurrencyChange,
  } = useTableQuery<StockTransaction>(rows, !!viewOnly);
  const { page, sort, search } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [rows]);

  const renderCell = useCallback((stock: any, columnKey: any) => {
    const cellValue = stock[columnKey];
    switch (columnKey) {
      case "transaction_type":
        return TRANSACTION_TYPES.find(
          (tt) => tt.value === stock.transaction_type
        )!.name;
      case "price":
        return numberFormat(stock.currency, parseFloat(stock.price));
      case "commission":
        return numberFormat(stock.currency, parseFloat(stock.commission));
      default:
        return cellValue;
    }
  }, []);

  return (
    <Block
      title={title}
      className="w-screen sm:w-full"
      cta={
        topContent
          ? topContent
          : !simplified && (
              <TopContent
                selected={[]}
                handleSearch={handleSearch}
                search={search}
                type="stock"
                addHref="/stocks/transaction"
                state={{
                  currency: {
                    value: searchQuery.currency,
                    onChange: handleCurrencyChange,
                  },
                }}
              />
            )
      }
    >
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          removeWrapper
          shadow="none"
          color="primary"
          aria-label="transactions-table"
          sortDescriptor={{
            column: sort?.includes("-")
              ? sort?.split("-")[1]
              : sort?.toString(),
            direction: sort?.includes("-") ? "descending" : "ascending",
          }}
          onSortChange={(descriptor: SortDescriptor) => {
            !viewOnly && setIsLoading(true);
            setSearchQuery((prev) => ({
              ...prev,
              page: 1,
              sort:
                (descriptor.direction === "descending" ? "-" : "") +
                descriptor.column,
            }));
          }}
          className="max-w-full w-full flex-1"
        >
          <TableHeader>
            {columns({ viewOnly: !!viewOnly, simplified }).map((column) => (
              <TableColumn
                key={column.key}
                allowsSorting={
                  count > 0 && !viewOnly && !simplified ? true : undefined
                }
                className="sm:h-10 h-8 text-tiny"
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner />}
            items={viewOnly ? items : rows}
            emptyContent={
              <div className="text-center flex-1 justify-center flex flex-col items-center gap-3">
                {viewOnly ? (
                  <p>Dodaj akcje, aby zobaczyć je na podglądzie.</p>
                ) : (
                  <Empty
                    title="Nie masz jeszcze żadnych akcji!"
                    cta={{
                      title: "Dodaj transkację",
                      href: "/stocks/transactions/add",
                    }}
                  />
                )}
              </div>
            }
          >
            {(item) => (
              <TableRow key={item.id} className="hover:bg-light">
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollShadow>
      {count > 0 && !simplified && (
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
          onChange={(page: number) => {
            !viewOnly && setIsLoading(true);
            setSearchQuery((prev) => ({ ...prev, page }));
          }}
        />
      )}
      {children}
    </Block>
  );
}
