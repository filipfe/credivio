import CurrencySettings from "@/components/settings/preferences/currency-settings";
import LanguageSettings from "@/components/settings/preferences/language-settings";
import Block from "@/components/ui/block";
import { getPreferences } from "@/lib/settings/actions";

export default async function Page() {
  const { results: preferences } = await getPreferences();

  return (
    <div className="px-12 pt-8 pb-24 flex flex-col gap-8">
      <h1 className="text-3xl">Preferencje</h1>
      <section className="grid grid-cols-3 gap-y-10 gap-x-6">
        <Block>
          <CurrencySettings currency={preferences.currency} />
          <LanguageSettings language={preferences.language} />
        </Block>
      </section>
    </div>
  );
}
