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
import Add from "../general/cta/add";
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
import Delete from "../general/cta/delete";
import Edit from "../general/cta/edit";

type Props = {
  stocks: StockTransaction[];
  count: number;
  simplified?: boolean;
  setStocks?: Dispatch<SetStateAction<StockTransaction[]>>;
  viewOnly?: boolean;
  onRowSelect?: (id: string) => void;
  title: string;
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
  onRowSelect,
  title,
}: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Set<any> | "all">(
    new Set([])
  );
  const pages = Math.ceil(count / 10);
  const {
    setItems,
    items,
    isLoading,
    setIsLoading,
    searchQuery,
    setSearchQuery,
  } = useTableQuery<StockTransaction>(stocks, viewOnly);
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

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 justify-between h-10">
        <h2 className="text-lg">{title}</h2>
        <div className="flex items-center gap-1.5">
          {(selectedKeys === "all" || selectedKeys.size > 0) && (
            <Delete
              items={selectedKeys}
              count={count}
              type={"stock"}
              viewOnly={viewOnly}
              callback={() => {
                if (viewOnly) {
                  const keys: string[] =
                    selectedKeys === "all"
                      ? []
                      : Array.from(selectedKeys.values());
                  setItems((prev) =>
                    selectedKeys === "all"
                      ? []
                      : prev.filter((item) => !keys.includes(item.id))
                  );

                  setSearchQuery((prev) => ({ ...prev, page: 1 }));
                }
                setSelectedKeys(new Set([]));
              }}
            />
          )}
          {!viewOnly && (selectedKeys === "all" || selectedKeys.size > 0) && (
            <Edit
              type={"stocks/transaction"}
              id={Array.from(selectedKeys)[0]}
              isDisabled={selectedKeys === "all" || selectedKeys.size > 1}
            />
          )}
          {!viewOnly && count > 0 && <Add type={"stocks/transaction"} />}
        </div>
      </div>
    );
  }, [selectedKeys, page, pages, stocks, isLoading]);

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
  }, [selectedKeys, page, pages, stocks, isLoading]);

  return (
    <Table
      shadow="none"
      color="primary"
      aria-label="transactions-table"
      selectionMode={simplified ? "none" : viewOnly ? "single" : "multiple"}
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
      topContent={!simplified && topContent}
      topContentPlacement="outside"
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
      onSelectionChange={(e) => {
        setSelectedKeys(e);
        console.log(e);
        if (!viewOnly) return;
        const keys = [...Array.from(e)];
        const lastKey = keys.length === 0 ? null : keys[0].toString();
        lastKey && onRowSelect && onRowSelect(lastKey);
      }}
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
        items={viewOnly ? items : stocks}
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
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
