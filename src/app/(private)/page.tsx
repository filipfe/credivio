import PortfolioStructure from "@/components/dashboard/portfolio-structure";
import Stat from "@/components/dashboard/stat";
import AreaChart from "@/components/operation/charts/area-chart";
import BarChart from "@/components/operation/charts/bar-chart";
import { getOperations } from "@/lib/operation/actions";
import { getOwnStocks, getSpecificStocks } from "@/lib/stocks/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import prepareChartData from "@/utils/operation/prepare-chart-data";
import { CoinsIcon, SettingsIcon, Wallet2Icon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { results: expenses } = await getOperations("expense");
  const { results: incomes } = await getOperations("income");
  const { results: ownStocks } = await getOwnStocks();
  const ownStocksNames: string[] = ownStocks.reduce(
    (prev, curr) =>
      prev.includes(curr.symbol) ? prev : [...prev, curr.symbol],
    [] as string[]
  );
  const { results: ownStocksList } = await getSpecificStocks(ownStocksNames);
  const holdings = getStockHoldings(ownStocks);
  const totalIncome = incomes.reduce(
    (prev, curr) => prev + parseFloat(curr.amount),
    0
  );
  const totalExpenses = expenses.reduce(
    (prev, curr) => prev + parseFloat(curr.amount),
    0
  );
  const totalProfit = totalIncome - totalExpenses;
  const expenseChartData = prepareChartData(expenses);
  // const incomeChartData = prepareChartData(incomes);
  return (
    <div className="px-12 py-8 pb-24 flex flex-col xl:grid grid-cols-6 gap-6">
      {/* <h2 className="text-3xl col-span-6">Budżet</h2>
      <Budget amount="4162,92" currency="PLN" />
      <Budget amount="819,23" currency="USD" />
      <h2 className="text-3xl col-span-6">Statystyki</h2> */}
      <Stat
        title="Przychód"
        amount={totalIncome.toFixed(2).toString()}
        currency="PLN"
        description=""
        previous={{ amount: "100" }}
      />
      <Stat
        title="Wydatki"
        amount={totalExpenses.toFixed(2).toString()}
        currency="PLN"
        description=""
        previous={{ amount: "240" }}
      />
      <Stat
        title="Zysk"
        amount={totalProfit.toFixed(2).toString()}
        currency="PLN"
        description=""
        previous={{ amount: "100" }}
      />
      {expenseChartData.length > 0 && (
        <div className="xl:col-span-3 bg-white rounded-lg px-10 py-8">
          <h3 className="mb-4 text-center">Wydatki wg Etykieta</h3>
          <BarChart data={expenseChartData} />
        </div>
      )}
      {expenseChartData.length > 0 && (
        <div className="xl:col-span-3 bg-white rounded-lg px-10 py-8">
          <h3 className="mb-4 text-center">Zysk wg Miesiąc</h3>
          <AreaChart data={expenseChartData} />
        </div>
      )}
      <div className="bg-white rounded-lg py-8 px-10 space-y-4 col-span-6">
        <PortfolioStructure
          holdings={holdings}
          stocks={ownStocksList.filter((item) => holdings[item._symbol] !== 0)}
          cash={totalProfit}
        />
      </div>
      <Link
        href="/incomes/add"
        className="bg-white rounded-lg py-8 px-10 flex flex-col items-center gap-4"
      >
        <Wallet2Icon size={48} strokeWidth={1} />
        <p className="font-medium text-center">Dodaj przychód</p>
      </Link>
      <Link
        href="/expenses/add"
        className="bg-white rounded-lg py-8 px-10 flex flex-col items-center gap-4"
      >
        <CoinsIcon size={48} strokeWidth={1} />
        <p className="font-medium text-center">Dodaj wydatek</p>
      </Link>
      <Link
        href="/settings"
        className="bg-white rounded-lg py-8 px-10 flex flex-col items-center gap-4"
      >
        <SettingsIcon size={48} strokeWidth={1} />
        <p className="font-medium text-center">Zmień ustawienia</p>
      </Link>
    </div>
  );
}
