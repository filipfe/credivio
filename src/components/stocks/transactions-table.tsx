"use client";

import { Pagination, Spinner } from "@nextui-org/react";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Add from "../operation/cta/add";
import { TRANSACTION_TYPES } from "@/const";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const columns = (viewOnly?: boolean) => [
  ...(!viewOnly ? [{ key: "issued_at", label: "DATA ZAWARCIA" }] : []),
  { key: "symbol", label: "INSTRUMENT" },
  { key: "transaction_type", label: "TYP TRANSAKCJI" },
  { key: "quantity", label: "ILOŚĆ" },
  { key: "price", label: "CENA" },
  ...(!viewOnly ? [{ key: "value", label: "WARTOŚĆ" }] : []),
  ...(!viewOnly ? [{ key: "currency", label: "WALUTA" }] : []),
  { key: "commission", label: "PROWIZJA" },
];

type Props = {
  stocks: StockTransaction[];
  count: number;
  viewOnly?: boolean;
  title?: string;
};

type SearchQuery = {
  page: number;
  sort?: string;
};

export default function TransactionTable({
  stocks,
  count,
  viewOnly,
  title,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<StockTransaction[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<any> | "all">(
    new Set([])
  );
  const pages = Math.ceil(count / 10);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    page: 1,
  });

  useEffect(() => {
    if (!viewOnly) return;
    const start = (searchQuery.page - 1) * 10;
    const end = start + 10;
    return setItems(stocks.slice(start, end));
  }, [searchQuery.page]);

  useEffect(() => {
    setIsLoading(false);
  }, [stocks]);

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

  const renderCell = useCallback(
    (stock: StockTransaction, columnKey: keyof StockTransaction) => {
      const cellValue = stock[columnKey];
      switch (columnKey) {
        case "transaction_type":
          return TRANSACTION_TYPES.find(
            (tt) => tt.value === stock.transaction_type
          )!.name;
        case "price":
          const formatter = new Intl.NumberFormat("pl-PL", {
            currency: stock.currency,
            style: "currency",
          });
          return formatter.format(parseFloat(stock.price));
        default:
          return cellValue;
      }
    },
    []
  );

  const bottomContent = useMemo(() => {
    return (
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
            !viewOnly && setIsLoading(true);
            setSearchQuery((prev) => ({ ...prev, page }));
          }}
        />
      </div>
    );
  }, [selectedKeys, count, searchQuery, stocks, isLoading]);

  return (
    <div className="bg-white rounded-lg py-8 px-10 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-lg">{title}</h1>
        {/* <div className="flex items-center gap-1.5">
          {(selectedKeys === "all" || selectedKeys.size > 0) && (
            <Delete
              items={selectedKeys}
              count={count}
              type={type}
              callback={() => {
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
        </div> */}
      </div>
      <Table
        shadow="none"
        color="primary"
        aria-label="Transactions table"
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
        bottomContent={count > 0 && bottomContent}
        bottomContentPlacement="outside"
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
          {columns(viewOnly).map((column) => (
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
          loadingContent={<Spinner />}
          emptyContent={
            <div className="text-center flex-1 justify-center flex flex-col items-center gap-4">
              {viewOnly ? (
                <p>Dodaj akcje, aby zobaczyć je na podglądzie.</p>
              ) : (
                <>
                  <p>Nie masz jeszcze żadnych akcji!</p>
                  <Add type="stock" />
                </>
              )}
            </div>
          }
        >
          {(viewOnly ? items : stocks).map((stock, i) => (
            <TableRow key={stock.id || `stock:${i}:${searchQuery.page}`}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(stock, columnKey as keyof StockTransaction)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
