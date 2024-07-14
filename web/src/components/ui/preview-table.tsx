"use client";

import { MouseEvent, ReactNode, useEffect, useState } from "react";
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
  Button,
} from "@nextui-org/react";
import useTableQuery from "@/hooks/useTableQuery";
import useSelection from "@/hooks/useSelection";
import { PaperclipIcon } from "lucide-react";
import Block from "./block";
import TopContent from "./table/top-content";
import DocModal from "../operations/modals/doc-modal";
import Empty from "./empty";
import { TRANSACTION_TYPES } from "@/const";

const getColumns = (type: OperationType, hasDoc: boolean) => {
  if (type === "stock") {
    return [
      { key: "issued_at", label: "DATA" },
      { key: "symbol", label: "INSTRUMENT" },
      { key: "transaction_type", label: "TRANSAKCJA" },
      { key: "quantity", label: "ILOŚĆ" },
      { key: "price", label: "CENA" },
      { key: "commission", label: "PROWIZJA" },
    ];
  } else {
    return [
      { key: "issued_at", label: "DATA" },
      { key: "title", label: "TYTUŁ" },
      { key: "amount", label: "KWOTA" },
      { key: "currency", label: "WALUTA" },
      ...(hasDoc ? [{ key: "doc_path", label: "" }] : []),
    ];
  }
};

const renderCell = (
  item: any,
  columnKey: any,
  setDocPath: (path: string) => void
) => {
  const cellValue = item[columnKey];

  switch (columnKey) {
    case "issued_at":
      return (
        <span className="line-clamp-1 break-all w-[10ch]">
          {new Intl.DateTimeFormat("pl-PL", {
            dateStyle: "short",
          }).format(new Date(cellValue))}
        </span>
      );
    case "title":
      return (
        <span className="line-clamp-1 break-all xl:max-w-[5vw]">
          {cellValue}
        </span>
      );
    case "transaction_type":
      const transactionType = TRANSACTION_TYPES.find(
        (type) => type.value === cellValue
      )?.name;
      return (
        <span className="line-clamp-1 break-all xl:max-w-[5vw]">
          {transactionType || cellValue}
        </span>
      );
    case "doc_path":
      const handleChange = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDocPath(cellValue);
      };
      return cellValue ? (
        <Button
          size="sm"
          isIconOnly
          onClick={handleChange}
          radius="md"
          disableRipple
          className="flex items-center ml-auto relative z-40 -my-2 border border-primary/10"
        >
          <PaperclipIcon size={18} />
        </Button>
      ) : (
        <></>
      );
    default:
      return <span className="line-clamp-1 break-all">{cellValue}</span>;
  }
};

type Props<T> = {
  count: number;
  children?: ReactNode;
  type: OperationType;
  rows: T[];
  topContent?: ReactNode;
};

export default function PreviewTable({
  count,
  children,
  type,
  rows,
}: Props<Operation | StockTransaction>) {
  const [docPath, setDocPath] = useState<string | null>(null);
  const pages = Math.ceil(count / 10);
  const {
    items,
    setItems,
    isLoading,
    setIsLoading,
    searchQuery,
    handleSearch,
    handlePageChange,
    handleCurrencyChange,
  } = useTableQuery(rows, true);
  const { page, search, currency } = searchQuery;
  const {
    selectionMode,
    selectedKeys,
    onSelectionChange,
    onRowAction,
    setSelectedKeys,
  } = useSelection(items.map((item) => item.id));

  useEffect(() => {
    let filteredRows = [...rows];
    if (search) {
      filteredRows = filteredRows.filter((row) => {
        if (type === "stock") {
          return (row as StockTransaction).symbol.toLowerCase();
        } else {
          return (row as Operation).title
            .toLowerCase()
            .includes(search.toLowerCase());
        }
      });
    }

    if (currency) {
      filteredRows = filteredRows.filter((row) =>
        row.currency.includes(currency)
      );
    }

    const start = ((searchQuery.page || 1) - 1) * 10;
    const end = start + 10;
    setItems(filteredRows.slice(start, end));

    isLoading && setIsLoading(false);
  }, [rows, searchQuery]);

  return (
    <Block
      title={"Podgląd"}
      className="w-screen sm:w-full"
      hideTitleMobile
      cta={
        <TopContent
          type={type}
          selected={selectedKeys}
          handleSearch={handleSearch}
          deletionCallback={() => setSelectedKeys([])}
          search={search}
          state={{
            currency: {
              value: searchQuery.currency,
              onChange: handleCurrencyChange,
            },
          }}
          viewOnly
        />
      }
    >
      <DocModal docPath={docPath} setDocPath={setDocPath} />
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          removeWrapper
          shadow="none"
          color="default"
          topContentPlacement="outside"
          bottomContentPlacement="outside"
          aria-label="operations-table"
          className="max-w-full w-full flex-1"
          selectionMode={selectionMode}
          selectedKeys={
            items.every((item) => selectedKeys.includes(item.id))
              ? "all"
              : new Set(selectedKeys)
          }
          onSelectionChange={onSelectionChange}
          classNames={{
            tr: "data-[selected=true]:[&>td]:before:bg-[#f2f2f2] [&_label[data-selected=true]>span::after]:bg-[#dadada]",
            td: "[&_span:last-child]:before:!border-neutral-200",
          }}
        >
          <TableHeader>
            {getColumns(
              type,
              items.some(
                (item) => type !== "stock" && (item as Operation).doc_path
              )
            ).map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={items}
            isLoading={isLoading}
            emptyContent={
              <Empty
                title={`Dodaj ${
                  type === "stock" ? "akcje" : "operacje"
                }, aby zobaczyć je na podglądzie.`}
              />
            }
            loadingContent={<Spinner />}
          >
            {(operation) => (
              <TableRow
                onDoubleClick={(_event) => onRowAction(operation.id)}
                key={operation.id}
                className="hover:bg-light"
              >
                {(columnKey) => (
                  <TableCell>
                    {renderCell(operation, columnKey, setDocPath)}
                  </TableCell>
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
