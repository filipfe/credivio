import CurrencySelect from "@/components/settings/inputs/currency";
import LocationInput from "@/components/settings/inputs/location";
import { getPreferences } from "@/lib/settings/actions";

export default async function Preferences() {
  const { result: preferences, error } = await getPreferences();

  if (error || !preferences) {
    throw new Error("Couldn't retrieve preferences");
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
      <div className="lg:pr-8 grid gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mb-2">
            <h3>Domyślna waluta</h3>
            <p className="text-sm text-font/60">
              Używana domyślnie w aplikacji
            </p>
          </div>
          <CurrencySelect defaultValue={preferences.currency} />
        </div>
        <LocationInput {...preferences} />
      </div>
    </div>
  );
}
