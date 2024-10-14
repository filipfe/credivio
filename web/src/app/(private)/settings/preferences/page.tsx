import CurrencySelect from "@/components/settings/inputs/currency";
import LocationInput from "@/components/settings/inputs/location";
import { getSettings } from "@/lib/general/actions";

export default async function Preferences() {
  const { result: settings } = await getSettings();

  if (!settings) {
    throw new Error("Couldn't retrieve settings");
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
          <CurrencySelect defaultValue={settings.currency} />
        </div>
        <LocationInput languageCode={settings.language} />
      </div>
    </div>
  );
}
