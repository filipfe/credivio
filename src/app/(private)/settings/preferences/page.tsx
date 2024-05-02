import Block from "@/components/ui/block";
import CurrencySelect from "@/components/ui/table/currency-select";
import LanguageSelect from "@/components/ui/language-select";
import { getPreferences, updatePreferences } from "@/lib/settings/actions";
import { Button } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";

export default async function Page() {
  const { results } = await getPreferences();
  const preferences = results[0];

  return (
    <div className="px-12 pt-8 pb-24 flex flex-col gap-8">
      <h1 className="text-3xl">Preferencje</h1>
      <section className="grid grid-cols-3 gap-y-10 gap-x-6">
        <form action={updatePreferences}>
          <Block>
            <div>
              <h2 className="text-lg font-bold">Waluta</h2>
              <CurrencySelect
                value={preferences.currency}
                onChange={(value) => {}}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold">Język</h2>
              <LanguageSelect defaultSelectedKeys={[preferences.language]} />
            </div>
            <Button
              type="submit"
              color="primary"
              variant="light"
              className="self-end"
            >
              <CheckIcon size={16} />
              Zapisz
            </Button>
          </Block>
        </form>
      </section>
    </div>
  );
}
