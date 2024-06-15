import StockTable from "../../stocks/table";
import PieChart from "../../ui/charts/pie-chart";
import React from "react";
import { COLORS } from "@/const";
import { getSpecificStocks } from "@/lib/stocks/actions";
import { getOwnRows } from "@/lib/general/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import PortfolioAccordion from "./accordion";
import { getPortfolioBudgets } from "@/lib/operations/actions";
import BudgetTable from "../table";
import Block from "@/components/ui/block";

export default async function PortfolioStructure() {
  const [{ results: budgets }, { results: ownStocks }] = await Promise.all([
    getPortfolioBudgets(),
    getOwnRows<StockTransaction>("stock"),
  ]);
  const ownStocksNames: string[] = ownStocks.reduce(
    (prev, curr) =>
      prev.includes(curr.symbol) ? prev : [...prev, curr.symbol],
    [] as string[]
  );
  const { results: ownStocksList } = await getSpecificStocks(ownStocksNames);
  const holdings = getStockHoldings(ownStocks);

  const stocks = ownStocksList.filter((item) => holdings[item._symbol] !== 0);
  const stocksTotal = stocks.reduce(
    (prev, curr) => (prev += parseFloat(curr._quote) * holdings[curr._symbol]),
    0
  );

  const data: Group[] = [
    {
      label: "Gotówka",
      value: 0,
      name: "cash",
      children: <BudgetTable budgets={budgets} />,
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
    <Block className="col-span-6">
      <div className="flex flex-col xl:grid grid-cols-5 gap-8 items-start">
        <PortfolioAccordion data={data} />
        <div className="col-span-2">
          <PieChart data={data} height={500} legend />
        </div>
      </div>
    </Block>
  );
}
