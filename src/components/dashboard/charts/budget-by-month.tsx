import AreaChart from "@/components/ui/charts/line-chart";
import { getDailyTotalAmount } from "@/lib/operation/actions";

export default async function BudgetByMonth({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const { results: dailyTotalAmount } = await getDailyTotalAmount(
    defaultCurrency
  );

  return (
    <div className="xl:col-span-3 bg-white sm:rounded-md px-6 py-8 h-full">
      <h3 className="mb-4 text-center">Budżet wg 30 dni</h3>
      <AreaChart data={dailyTotalAmount} defaultCurrency={defaultCurrency} />
    </div>
  );
}
