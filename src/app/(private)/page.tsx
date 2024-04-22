import PortfolioStructure from "@/components/dashboard/portfolio-structure";
import AreaChart from "@/components/ui/charts/area-chart";
import BarChart from "@/components/ui/charts/bar-chart";
import { CoinsIcon, SettingsIcon, Wallet2Icon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@nextui-org/react";
import { getChartLabels, getDailyTotalAmount } from "@/lib/operation/actions";
import { Fragment, Suspense } from "react";
import StatsList from "@/components/dashboard/stats/list";
import Loader from "@/components/stocks/loader";

export default async function Home() {
  const chartLabelsData = getChartLabels();
  const dailyTotalAmountData = getDailyTotalAmount();

  const [{ results: chartLabels }, { results: dailyTotalAmount }] =
    await Promise.all([chartLabelsData, dailyTotalAmountData]);

  return (
    <div className="px-12 py-8 pb-24 flex flex-col xl:grid grid-cols-6 gap-6">
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
      <Suspense
        fallback={
          <Fragment>
            <Skeleton className="xl:col-span-2" />
            <Skeleton className="xl:col-span-2" />
            <Skeleton className="xl:col-span-2" />
          </Fragment>
        }
      >
        <StatsList />
      </Suspense>
      <div className="xl:col-span-3 bg-white rounded-lg px-10 py-8">
        <h3 className="mb-4 text-center">Wydatki wg Etykieta</h3>
        <BarChart data={chartLabels} />
      </div>
      <div className="xl:col-span-3 bg-white rounded-lg px-10 py-8">
        <h3 className="mb-4 text-center">30 dni</h3>
        <AreaChart data={dailyTotalAmount} />
      </div>
      <Suspense fallback={<Loader className="col-span-6" />}>
        <PortfolioStructure />
      </Suspense>
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
