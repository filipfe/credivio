import CurrencySelect from "./currency";
import LanguageSelect from "./language";

export default function LocationInput({
  currency,
  language,
}: Pick<Preferences, "currency" | "language">) {
  console.log(currency, language);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-2">
        <h3>Lokalizacja</h3>
        <p className="text-sm text-font/60">Wybierz język i domyślną walutę</p>
      </div>
      <CurrencySelect defaultValue={currency} />
      {/* <LanguageSelect defaultValue={language.name} /> */}
    </div>
  );
}
