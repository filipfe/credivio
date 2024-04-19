import PortfolioStructure from "@/components/dashboard/portfolio-structure";
import Stat from "@/components/dashboard/stat";
import AreaChart from "@/components/operation/charts/area-chart";
import BarChart from "@/components/operation/charts/bar-chart";
import { getOwnRows } from "@/lib/general/actions";
import { getSpecificStocks } from "@/lib/stocks/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import { CoinsIcon, SettingsIcon, Wallet2Icon } from "lucide-react";
import Link from "next/link";
import { ScrollShadow } from "@nextui-org/react";
import OperationRef from "@/components/operation/ref";
import {
  getChartLabels,
  getDailyTotalAmount,
  getDashboardStats,
} from "@/lib/operation/actions";

export default async function Home() {
  const expensesData = getOwnRows<Operation>("expense");
  const incomesData = getOwnRows<Operation>("income");
  const ownStocksData = getOwnRows<StockTransaction>("stock");
  const chartLabelsData = getChartLabels();
  const dailyTotalAmountData = getDailyTotalAmount();
  const dashboardStatsData = getDashboardStats();
  const [
    { results: expenses },
    { results: incomes },
    { results: ownStocks },
    { results: chartLabels },
    { results: dailyTotalAmount },
    { results: dashboardStats },
  ] = await Promise.all([
    expensesData,
    incomesData,
    ownStocksData,
    chartLabelsData,
    dailyTotalAmountData,
    dashboardStatsData,
  ]);
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

  return (
    <div className="px-12 py-8 pb-24 flex flex-col gap-6">
      {/* {expenses.length > 0 && (
        <ScrollShadow
          orientation="horizontal"
          hideScrollBar
          className="grid grid-cols-10 gap-6"
        >
          {expenses.map((item, k) => (
            <OperationRef {...item} type={"expense"} key={`op:${k}`} />
          ))}
        </ScrollShadow>
      )} */}

      <div className="xl:grid grid-cols-6 gap-6">
        <Stat
          title="Przychody"
          currency="PLN"
          description=""
          stat={dashboardStats[0].incomes}
        />
        <Stat
          title="Wydatki"
          currency="PLN"
          description=""
          stat={dashboardStats[0].expenses}
        />
        <Stat
          title="Budżet"
          currency="PLN"
          description=""
          stat={dashboardStats[0].budget}
        />
        <div className="xl:col-span-3 bg-white rounded-lg px-10 py-8">
          <h3 className="mb-4 text-center">Wydatki wg Etykieta</h3>
          <BarChart data={chartLabels} />
        </div>
        <div className="xl:col-span-3 bg-white rounded-lg px-10 py-8">
          <h3 className="mb-4 text-center">30 dni</h3>
          <AreaChart data={dailyTotalAmount} />
        </div>
        <div className="bg-white rounded-lg py-8 px-10 space-y-4 col-span-6">
          <PortfolioStructure
            holdings={holdings}
            stocks={ownStocksList.filter(
              (item) => holdings[item._symbol] !== 0
            )}
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
    </div>
  );
}
