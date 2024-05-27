"use client";

import AreaChart from "@/components/ui/charts/line-chart";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { getDailyTotalAmount } from "@/lib/operation/actions";
import { useEffect, useState } from "react";

export default async function OperationsByMonth({
  type,
  defaultCurrency,
}: {
  type: string;
  defaultCurrency: string;
}) {
  const [dailyTotalAmount, setDailyTotalAmount] = useState<DailyAmount[]>([]);
  const [currency, setCurrency] = useState<string>(defaultCurrency);

  useEffect(() => {
    async function fetchData() {
      const { results } = await getDailyTotalAmount(currency, type);
      setDailyTotalAmount(results);
    }
    fetchData();
  }, [currency]);

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
            defaultSelectedKeys={[currency]}
            elements={CURRENCIES}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>
      ) : (
        <h3 className="mb-4 text-center">
          {type === "income" ? "Przychody" : "Wydatki"} wg 30 dni
        </h3>
      )}
      <AreaChart data={dailyTotalAmount} currency={currency} type={type} />
    </div>
  );
}
