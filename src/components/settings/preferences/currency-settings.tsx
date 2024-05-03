"use client";

import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { updatePreferences } from "@/lib/settings/actions";

export default function CurrencySettings({ currency }: { currency: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold">Waluta</h2>
      <div className="flex text-nowrap items-center justify-between">
        Wybierz domyślną walutę
        <UniversalSelect
          className="w-32"
          size="sm"
          name="currency"
          aria-label="Waluta"
          defaultSelectedKeys={[currency]}
          elements={CURRENCIES}
          onChange={(e) => updatePreferences("currency", e.target.value)}
        />
      </div>
    </div>
  );
}
