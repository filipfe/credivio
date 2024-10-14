"use client";

import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
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
import TopContent from "../ui/table/top-content";
import Block from "../ui/block";
import Empty from "../ui/empty";
import { PaperclipIcon } from "lucide-react";
import DocModal from "./modals/doc-modal";
import ActionsDropdown from "./actions-dropdown";
import { PeriodContext } from "@/app/(private)/(operations)/providers";

export default function OperationTable({
  rows,
  count,
  children,
  viewOnly,
  settings,
  ...props
}: TableProps<Operation> & { settings: Settings }) {
  const [docPath, setDocPath] = useState<string | null>(null);
  const pages = Math.ceil(count / 10);
  const { period } = useContext(PeriodContext);
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
  } = useTableQuery(rows, { viewOnly: !!viewOnly, period });
  // const {
  //   selectionMode,
  //   selectedKeys,
  //   onSelectionChange,
  //   onRowAction,
  //   setSelectedKeys,
  // } = useSelection((viewOnly ? items : rows).map((item) => item.id));
  const { page, sort, search, label: _label } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [rows]);

  const columns = useCallback(
    (hasLabel: boolean, hasDoc: boolean) => [
      { key: "issued_at", label: "DATA" },
      { key: "title", label: "TYTUŁ" },
      { key: "amount", label: "KWOTA" },
      { key: "currency", label: "WALUTA" },
      ...(hasLabel ? [{ key: "label", label: "ETYKIETA" }] : []),
      ...(hasDoc ? [{ key: "doc_path", label: "" }] : []),
      { key: "actions", label: "" },
    ],
    [page]
  );

  const renderCell = useCallback(
    (item: any, columnKey: any) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "title":
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
        case "label":
          return (
            <span className="line-clamp-1 break-all">{cellValue || "-"}</span>
          );
        case "issued_at":
          return (
            <span className="line-clamp-1 break-all w-[10ch]">
              {new Intl.DateTimeFormat(settings.language, {
                dateStyle: "short",
                timeZone: settings.timezone,
              }).format(new Date(cellValue))}
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
        // case "actions":
        //   return selectedKeys.length === 0 ? (
        //     <ActionsDropdown
        //       type={props.type}
        //       operation={item}
        //       onSelect={() => onRowAction(item.id)}
        //     />
        //   ) : (
        //     <></>
        //   );
        case "actions":
          return <ActionsDropdown type={props.type} operation={item} />;
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    },
    [
      // selectedKeys,
      props.type,
      //  onRowAction
    ]
  );

  return (
    <Block
      title={props.title}
      className="w-screen sm:w-full"
      hideTitleMobile
      cta={
        <TopContent
          {...props}
          viewOnly={false}
          // selected={selectedKeys}
          handleSearch={handleSearch}
          // deletionCallback={() => setSelectedKeys([])}
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
          showPeriodFilter
        />
      }
    >
      <DocModal docPath={docPath} setDocPath={setDocPath} />
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
          classNames={{
            td: "[&_span:last-child]:before:!border-neutral-200",
          }}
        >
          <TableHeader>
            {columns(
              rows.some((item) => item.label),
              rows.some((item) => item.doc_path)
            ).map((column) => (
              <TableColumn
                key={column.key}
                allowsSorting={
                  column.key !== "actions" && column.key !== "doc_path"
                }
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={isLoading}
            emptyContent={
              <Empty
                title="Nie znaleziono operacji"
                cta={{
                  title: `Dodaj ${
                    props.type === "expense" ? "wydatek" : "przychód"
                  }`,
                  href: `/${props.type}s/add`,
                }}
              />
            }
            loadingContent={<Spinner />}
          >
            {(operation) => (
              <TableRow className="hover:bg-light" key={operation.id}>
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
