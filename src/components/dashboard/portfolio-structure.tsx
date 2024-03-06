"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import StockTable from "../stocks/table";
import { ResponsiveContainer } from "recharts";
import PieChart from "../operation/charts/pie-chart";
import React from "react";
import { COLORS } from "@/const";

type Props = {
  stocks: Stock[];
  cash: number;
  holdings: Holdings;
};

export default function PortfolioStructure({ stocks, cash, holdings }: Props) {
  const stocksTotal = stocks.reduce(
    (prev, curr) => (prev += parseFloat(curr._quote) * holdings[curr._symbol]),
    0
  );
  const total = cash + stocksTotal;

  const data: Group[] = [
    {
      label: "Gotówka",
      value: cash,
      name: "cash",
      children: <></>,
    },
    {
      label: "Akcje",
      value: stocksTotal,
      name: "stocks",
      children: (
        <StockTable
          quantityVisible
          stocks={stocks.map((stock) => ({
            ...stock,
            quantity: holdings[stock._symbol],
          }))}
        />
      ),
    },
  ]
    .sort((a, b) => b.value - a.value)
    .map((item, k) => ({ ...item, color: COLORS[k % COLORS.length] }));

  return (
    <div className="flex flex-col xl:grid grid-cols-5 gap-8 items-start min-h-[30rem]">
      <Accordion className="col-span-3">
        {data.map(({ children, name, value, color, label }, k) => (
          <AccordionItem
            title={
              <div className="flex items-center gap-4">
                <div
                  style={{ backgroundColor: color }}
                  className="w-6 h-4 rounded"
                ></div>
                <span className="text-lg">{label}</span>
                <span className="text-sm">
                  {((value / total) * 100).toFixed(2)}%
                </span>
              </div>
            }
            key={name}
          >
            {children}
          </AccordionItem>
        ))}
      </Accordion>
      <div className="col-span-2">
        <PieChart data={data} height={500} legend />
      </div>
    </div>
  );
}
