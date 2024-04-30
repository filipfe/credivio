import CurrencySelect from "@/components/ui/currency-select";
import LanguageSelect from "@/components/ui/language-select";
import { getPreferences, updatePreferences } from "@/lib/settings/actions";
import { Button } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";

export default async function Page() {
  const { results } = await getPreferences();

  return (
    <div className="px-12 pt-8 pb-24 flex flex-col gap-8">
      <h1 className="text-3xl">Preferencje</h1>
      <section className="grid grid-cols-3 gap-y-10 gap-x-6">
        <form
          className="bg-white rounded-lg py-8 px-10 flex flex-col gap-4"
          action={updatePreferences}
        >
          <div>
            <h2 className="text-lg font-bold">Waluta</h2>
            <CurrencySelect
              label="Wybierz domyślną walutę"
              isRequired={false}
              labelPlacement="outside-left"
              inputProps={{
                classNames: {
                  inputWrapper: "!bg-light",
                },
              }}
              defaultSelectedKey={results[0].currency}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold">Język</h2>
            <LanguageSelect defaultSelectedKey={results[0].language} />
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
        </form>
      </section>
    </div>
  );
}
