import AreaChart from "@/components/ui/charts/line-chart";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { getDailyTotalAmount } from "@/lib/operation/actions";

export default async function OperationsByMonth({
  type,
  defaultCurrency,
}: {
  type: string;
  defaultCurrency: string;
}) {
  const { results: dailyTotalAmount } = await getDailyTotalAmount(
    defaultCurrency,
    type
  );

  return (
    <div className="xl:col-span-3 bg-white sm:rounded-md px-6 py-8 h-full">
      {type === "budget" ? (
        <div className="flex justify-between items-center ml-[12px] mr-[36px] mb-4">
          <h3>Budżet wg 30 dni</h3>
          <UniversalSelect
            className="w-20"
            size="sm"
            name="currency"
            aria-label="Waluta"
            defaultSelectedKeys={[defaultCurrency]}
            elements={CURRENCIES}
          />
        </div>
      ) : (
        <h3 className="mb-4 text-center">
          {type === "income" ? "Przychody" : "Wydatki"} wg 30 dni
        </h3>
      )}
      <AreaChart
        data={dailyTotalAmount}
        defaultCurrency={defaultCurrency}
        type={type}
      />
    </div>
  );
}
