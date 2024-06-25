import CurrencySelect from "@/components/settings/preferences/inputs/currency";
import LanguageSelect from "@/components/settings/preferences/inputs/language";
import Block from "@/components/ui/block";
import { getPreferences } from "@/lib/settings/actions";

export default async function Page() {
  const { result: preferences, error } = await getPreferences();

  if (!preferences) throw new Error(error || "Unable to load the resource");

  return (
    <section className="sm:px-10 py-4 sm:py-8 flex flex-col lg:grid grid-cols-3 gap-4 sm:gap-6">
      <Block title="Lokalizacja">
        <CurrencySelect defaultValue={preferences["currency"]} />
        <LanguageSelect defaultValue={preferences["language"].name} />
      </Block>
    </section>
  );
}
