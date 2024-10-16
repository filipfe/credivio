"use client";

import { cn } from "@nextui-org/react";
import Block from "../../ui/block";
import NumberFormat from "@/utils/formatters/currency";
import { Dict } from "@/const/dict";

export default function Comparison({
  dict,
  incomes,
  expenses,
  balance,
  currency,
}: {
  dict: {
    incomes: Dict["private"]["general"]["incomes"];
    expenses: Dict["private"]["general"]["expenses"];
  };
  incomes: number;
  expenses: number;
  balance: number;
  currency: string;
}) {
  const sum = incomes + expenses;

  const renderStat = (label: string, value: number, color: string) => (
    <div
      className={cn(
        "flex flex-col gap-1",
        label === dict.expenses && "items-end"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          style={{ backgroundColor: color }}
          className="h-2 w-2 rounded-full"
        ></div>
        <h4 className={`${label === dict.expenses && "order-first"}`}>
          {label}
        </h4>
      </div>
      <strong className="text-2xl">
        {sum > 0 ? ((value / sum) * 100).toFixed(1) : 50}%
      </strong>
      <h4 className="text-sm text-font/60">
        <NumberFormat currency={currency} amount={value} />
      </h4>
    </div>
  );

  return (
    <Block className="lg:col-span-2 flex flex-col justify-between">
      {/* <div className="flex justify-center">
        <strong className="text-4xl"><NumberFormat currency={currency} amount={balance} /></strong>
      </div> */}
      <div className="grid gap-4">
        <div className="flex justify-between">
          {renderStat(dict.incomes, incomes, "#177981")}
          {/* <div className={cn("flex flex-col gap-1")}>
            <div className="flex items-center gap-2">
              <h4>Bilans</h4>
            </div>
            <strong className="text-3xl">
              <NumberFormat currency={currency} amount={balance} />
            </strong>
          </div> */}
          {renderStat(dict.expenses, expenses, "#fdbb2d")}
        </div>
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
          <div
            style={{
              flexGrow: sum > 0 ? incomes / sum : 0.5,
              backgroundColor: "#177981",
              display: sum > 0 && incomes === 0 ? "none" : "block",
            }}
          ></div>
          <div
            style={{
              flexGrow: sum > 0 ? expenses / sum : 0.5,
              backgroundColor: "#fdbb2d",
              display: sum > 0 && expenses === 0 ? "none" : "block",
            }}
          ></div>
        </div>
      </div>
    </Block>
  );
}
