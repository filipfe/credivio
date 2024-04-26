import AreaChart from "@/components/ui/charts/line-chart";
import { getDailyTotalAmount } from "@/lib/operation/actions";

export default async function BudgetByMonth() {
  const { results: dailyTotalAmount } = await getDailyTotalAmount();

  return (
    <div className="xl:col-span-3 bg-white sm:rounded-md px-6 sm:px-10 py-8">
      <h3 className="mb-4 text-center">Budżet wg 30 dni</h3>
      <AreaChart data={dailyTotalAmount} />
    </div>
  );
}
