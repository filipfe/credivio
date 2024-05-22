import BarChart from "@/components/ui/charts/bar-chart";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { getChartLabels } from "@/lib/operation/actions";

export default async function ExpensesByLabel({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const { results: chartLabels } = await getChartLabels(defaultCurrency);
  return (
    <div className="xl:col-span-3 bg-white sm:rounded-md px-6 py-8">
      <div className="flex justify-between items-center ml-[8px] mr-[36px] mb-4">
        <h3>Wydatki wg Etykieta</h3>
        <UniversalSelect
          className="w-20"
          size="sm"
          name="currency"
          aria-label="Waluta"
          defaultSelectedKeys={[defaultCurrency]}
          elements={CURRENCIES}
        />
      </div>
      <BarChart data={chartLabels} defaultCurrency={defaultCurrency} />
    </div>
  );
}
