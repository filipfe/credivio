import BarChart from "@/components/ui/charts/bar-chart";
import { getChartLabels } from "@/lib/operation/actions";

export default async function ExpensesByLabel() {
  const { results: chartLabels } = await getChartLabels();
  return (
    <div className="xl:col-span-3 bg-white sm:rounded-md px-6 py-8">
      <h3 className="mb-4 text-center">Wydatki wg Etykieta</h3>
      <BarChart data={chartLabels} />
    </div>
  );
}
