"use client";

import { Spinner } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useCallback } from "react";

type Props = {
  budgets: Budget[];
};

const columns = [
  {
    key: "currency",
    label: "WALUTA",
  },
  {
    key: "budget",
    label: "BUDŻET",
  },
  {
    key: "difference",
    label: "ZMIANA",
  },
];

export default function BudgetTable({ budgets }: Props) {
  console.log(budgets);
  const renderCell = useCallback((budget: Budget, columnKey: keyof Budget) => {
    const cellValue = budget[columnKey];

    switch (columnKey) {
      case "difference":
        const indicatorClass = {
          positive: "text-success",
          negative: "text-danger",
          no_change: "text-font/70",
        }[budget.difference_indicator];

        const getTrendingIcon = () => {
          switch (budget.difference_indicator) {
            case "positive":
              return <TrendingUpIcon size={16} />;
            case "negative":
              return <TrendingDownIcon size={16} />;
            default:
              return null;
          }
        };

        return (
          <div className={`flex items-center gap-2 ${indicatorClass}`}>
            {getTrendingIcon()}
            <span className="font-medium">{cellValue}%</span>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <Table
      removeWrapper
      shadow="none"
      color="primary"
      className="max-w-full w-full flex-1"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={budgets}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.currency} className="hover:bg-[#f7f7f8]">
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof Budget)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
