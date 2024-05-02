import StockTable from "../../stocks/table";
import PieChart from "../../ui/charts/pie-chart";
import React from "react";
import { COLORS } from "@/const";
import { getSpecificStocks } from "@/lib/stocks/actions";
import { getOwnRows } from "@/lib/general/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import PortfolioAccordion from "./accordion";

export default async function PortfolioStructure() {
  const [{ results: expenses }, { results: incomes }, { results: ownStocks }] =
    await Promise.all([
      getOwnRows<Operation>("expense"),
      getOwnRows<Operation>("income"),
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

  const totalIncome = incomes.reduce(
    (prev, curr) => prev + parseFloat(curr.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (prev, curr) => prev + parseFloat(curr.amount),
    0
  );
  const cash = totalIncome - totalExpenses;

  const total = (cash < 0 ? 0 : cash) + stocksTotal;

  const data: Group[] = [
    {
      label: "Gotówka",
      value: cash < 0 ? 0 : cash,
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
    <div className="bg-white sm:rounded-md py-8 px-10 space-y-4 col-span-6">
      <div className="flex flex-col xl:grid grid-cols-5 gap-8 items-start">
        <PortfolioAccordion data={data} total={total} />
        <div className="col-span-2">
          <PieChart data={data} height={500} legend />
        </div>
      </div>
    </div>
  );
}
