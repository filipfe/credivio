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
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useTableQuery from "@/hooks/useTableQuery";

type Props = {
  stocks: StockTransaction[];
  count: number;
  simplified?: boolean;
  setStocks?: Dispatch<SetStateAction<StockTransaction[]>>;
  viewOnly?: boolean;
};

const columns = ({
  viewOnly,
  simplified,
}: Pick<Props, "simplified" | "viewOnly">) => [
  ...(!viewOnly ? [{ key: "issued_at", label: "DATA ZAWARCIA" }] : []),
  { key: "symbol", label: "INSTRUMENT" },
  { key: "transaction_type", label: "TYP TRANSAKCJI" },
  { key: "quantity", label: "ILOŚĆ" },
  { key: "price", label: "CENA" },
  ...(!viewOnly ? [{ key: "value", label: "WARTOŚĆ" }] : []),
  ...(!viewOnly ? [{ key: "currency", label: "WALUTA" }] : []),
  ...(!simplified ? [{ key: "commission", label: "PROWIZJA" }] : []),
];

export default function TransactionTable({
  stocks,
  count,
  simplified,
  setStocks,
  viewOnly,
}: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Set<any> | "all">(
    new Set([])
  );
  const pages = Math.ceil(count / 10);
  const { items, isLoading, setIsLoading, searchQuery, setSearchQuery } =
    useTableQuery(stocks, viewOnly);
  const { page, sort } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [stocks]);

  const renderCell = useCallback((stock: any, columnKey: any) => {
    const formatter = new Intl.NumberFormat("pl-PL", {
      currency: stock.currency,
      style: "currency",
    });
    const cellValue = stock[columnKey];
    switch (columnKey) {
      case "transaction_type":
        return TRANSACTION_TYPES.find(
          (tt) => tt.value === stock.transaction_type
        )!.name;
      case "price":
        return formatter.format(parseFloat(stock.price));
      case "commission":
        return formatter.format(parseFloat(stock.commission));
      default:
        return cellValue;
    }
  }, []);

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
  }, [selectedKeys, page, pages, stocks, isLoading]);

  return (
    <Table
      shadow="none"
      color="primary"
      aria-label="transactions-table"
      selectionMode={!simplified ? "multiple" : "none"}
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
      bottomContent={count > 0 && !simplified && bottomContent}
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
        {columns({ viewOnly, simplified }).map((column) => (
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
          <div className="text-center flex-1 justify-center flex flex-col items-center gap-3">
            {viewOnly ? (
              <p>Dodaj akcje, aby zobaczyć je na podglądzie.</p>
            ) : (
              <>
                <p className="text-font/80 text-sm">
                  Nie masz jeszcze żadnych akcji!
                </p>
                <Add type="stocks/transaction" size="sm" />
              </>
            )}
          </div>
        }
      >
        {(viewOnly ? items : stocks).map((stock, i) => (
          <TableRow key={stock.id || `stock:${i}:${searchQuery.page}`}>
            {(columnKey) => (
              <TableCell>{renderCell(stock, columnKey)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
