import TelegramBot from "@/components/automation/telegram-bot";
import Block from "@/components/ui/block";
import Form from "@/components/ui/form";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { getPreferences } from "@/lib/settings/actions";

export default async function AccountSetup() {
  const { result: preferences, error } = await getPreferences();

  if (!preferences) {
    console.error(error);
    throw new Error("Couldn't retrieve preferences");
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <div className="mx-auto w-full max-w-xl flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between h-1 w-full bg-primary rounded-full">
          {Array.from(Array(4)).map((step, k) => (
            <div
              className="bg-primary rounded-full h-4 w-4"
              key={`step-${k}`}
            />
          ))}
        </div>
        {false ? (
          <TelegramBot preferences={preferences!} />
        ) : (
          <Block
            title="Lokalizacja"
            description="Potrzebujemy tych informacji do wysyłania powiadomień i generowania statystyk"
          >
            <Form buttonProps={{ children: "Dalej" }}>
              <UniversalSelect
                label="Domyślna waluta"
                placeholder="USD"
                elements={CURRENCIES}
                required
                isRequired
              />
            </Form>
          </Block>
        )}
      </div>
    </div>
  );
}
