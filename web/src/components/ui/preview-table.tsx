"use client";

import {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
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
import { PaperclipIcon } from "lucide-react";
import Block from "./block";
import DocModal from "../operations/modals/doc-modal";
import Empty from "./empty";
import { TRANSACTION_TYPES } from "@/const";
import ActionsDropdown from "../operations/actions-dropdown";
import { useSettings } from "@/lib/general/queries";
import { Dict } from "@/const/dict";

type Props<T> = {
  title: string;
  dict: Dict["private"]["operations"]["operation-table"];
  count: number;
  children?: ReactNode;
  type: OperationType;
  rows: T[];
  topContent?: ReactNode;
  setRows: Dispatch<SetStateAction<T[]>>;
};

export default function PreviewTable({
  title,
  dict,
  count,
  children,
  type,
  rows,
  setRows,
}: Props<Operation | StockTransaction>) {
  const { data: settings } = useSettings();
  const [docPath, setDocPath] = useState<string | null>(null);
  const pages = Math.ceil(count / 10);
  const {
    items,
    setItems,
    isLoading,
    // setIsLoading,
    searchQuery,
    // handleSearch,
    handlePageChange,
    // handleCurrencyChange,
    // handleTransactionChange,
  } = useTableQuery(rows, { viewOnly: true });
  const { page } = searchQuery;
  // const { selectionMode, selectedKeys, onSelectionChange, onRowAction } =
  //   useSelection(items.map((item) => item.id));

  const getColumns = (type: OperationType, hasDoc: boolean) => {
    if (type === "stock") {
      return [
        { key: "issued_at", label: "DATA" },
        { key: "symbol", label: "INSTRUMENT" },
        { key: "transaction_type", label: "TRANSAKCJA" },
        { key: "quantity", label: "ILOŚĆ" },
        { key: "price", label: "CENA" },
        { key: "commission", label: "PROWIZJA" },
        { key: "actions", label: "" },
      ];
    } else {
      return [
        { key: "issued_at", label: dict.columns.issued_at },
        { key: "title", label: dict.columns.title },
        { key: "amount", label: dict.columns.amount },
        { key: "currency", label: dict.columns.currency },
        ...(hasDoc ? [{ key: "doc_path", label: "" }] : []),
        { key: "actions", label: "" },
      ];
    }
  };

  const renderCell = useCallback(
    (item: any, columnKey: any) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "issued_at":
          return cellValue ? (
            <span className="line-clamp-1 break-all w-[10ch]">
              {new Intl.DateTimeFormat(settings?.language, {
                dateStyle: "short",
              }).format(new Date(cellValue))}
            </span>
          ) : (
            <span>-</span>
          );
        case "title":
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
        case "transaction_type":
          const transactionType = TRANSACTION_TYPES.find(
            (type) => type.value === cellValue
          )?.name;
          return (
            <span className="line-clamp-1 break-all">
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
              className="flex items-center ml-auto relative z-40 -my-2 border"
            >
              <PaperclipIcon size={18} />
            </Button>
          ) : (
            <></>
          );
        case "actions":
          return (
            <ActionsDropdown
              dict={dict.dropdown}
              type={type}
              operation={item}
              // onSelect={() => onRowAction(item.id)}
              onDelete={(id) => {
                console.log(items);
                setItems((prev) => prev.filter((r) => r.id !== id));
                items.length === 0 && setRows([]);
              }}
              onEdit={(updated) =>
                setItems((prev) => {
                  const newArr = [...prev];
                  const index = newArr.findIndex((row) => row.id === item.id);
                  if (index === -1) return prev;
                  const newObj = { ...newArr[index], ...updated };
                  newArr[index] = newObj;
                  return newArr;
                })
              }
            />
          );
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    },
    [
      // onRowAction,
      setDocPath,
    ]
  );

  return (
    <Block
      title={title}
      className="max-w-3xl w-full mx-auto"
      // cta={
      //   <TopContent
      //     type={type}
      //     selected={selectedKeys}
      //     handleSearch={handleSearch}
      //     deletionCallback={() => setSelectedKeys([])}
      //     search={search}
      //     state={{
      //       currency: {
      //         value: searchQuery.currency,
      //         onChange: handleCurrencyChange,
      //       },
      //       ...(type === "stock" && {
      //         transaction: {
      //           value: searchQuery.transaction,
      //           onChange: handleTransactionChange,
      //         },
      //       }),
      //     }}
      //     viewOnly
      //   />
      // }
    >
      <DocModal dict={dict.modal} docPath={docPath} setDocPath={setDocPath} />
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          removeWrapper
          shadow="none"
          color="default"
          topContentPlacement="outside"
          bottomContentPlacement="outside"
          aria-label="operations-table"
          className="max-w-full w-full flex-1"
          // selectionMode={selectionMode}
          // selectedKeys={
          //   items.every((item) => selectedKeys.includes(item.id))
          //     ? "all"
          //     : new Set(selectedKeys)
          // }
          // onSelectionChange={onSelectionChange}
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
              <TableColumn
                allowsSorting={
                  column.key !== "actions" && column.key !== "doc_path"
                }
                key={column.key}
              >
                {column.label}
              </TableColumn>
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
              <TableRow key={operation.id} className="hover:bg-light">
                {(columnKey) => (
                  <TableCell>{renderCell(operation, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollShadow>
      {count > 0 && pages > 1 && (
        <div className="mt-2 flex-1 flex items-end justify-end">
          <Pagination
            size="sm"
            isCompact
            showControls
            showShadow={false}
            color="primary"
            className="text-background"
            classNames={{
              wrapper: "!shadow-none border",
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

// useEffect(() => {
//   let filteredRows = [...rows];
//   if (search) {
//     filteredRows = filteredRows.filter((row) => {
//       if (type === "stock") {
//         return (row as StockTransaction).symbol
//           .toLowerCase()
//           .includes(search.toLowerCase());
//       } else {
//         return (row as Operation).title
//           .toLowerCase()
//           .includes(search.toLowerCase());
//       }
//     });
//   }

//   if (currency) {
//     filteredRows = filteredRows.filter((row) =>
//       row.currency.includes(currency)
//     );
//   }

//   const start = ((searchQuery.page || 1) - 1) * 10;
//   const end = start + 10;
//   setItems(filteredRows.slice(start, end));

//   isLoading && setIsLoading(false);
// }, [rows, searchQuery]);
