import PortfolioStructure from "@/components/dashboard/portfolio-structure";
import Stat from "@/components/dashboard/stat";
import AreaChart from "@/components/ui/charts/area-chart";
import BarChart from "@/components/ui/charts/bar-chart";
import { getSpecificStocks } from "@/lib/stocks/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import prepareChartData from "@/utils/operation/prepare-chart-data";
import { CoinsIcon, SettingsIcon, Wallet2Icon } from "lucide-react";
import Link from "next/link";
import { getOwnRows } from "@/lib/general/actions";

export default async function Home() {
  const expensesData = getOwnRows<Operation>("expense");
  const incomesData = getOwnRows<Operation>("income");
  const ownStocksData = getOwnRows<StockTransaction>("stock");
  const [{ results: expenses }, { results: incomes }, { results: ownStocks }] =
    await Promise.all([expensesData, incomesData, ownStocksData]);
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
  return (
    <div className="px-6 sm:px-10 py-6 sm:pt-8 sm:pb-24 flex flex-col xl:grid grid-cols-6 gap-6">
      <Stat
        title="Przychody"
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
