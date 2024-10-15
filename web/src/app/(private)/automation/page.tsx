import LatestOperations from "@/components/automation/latest-operations";
import TelegramBot from "@/components/automation/telegram-bot";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function Page() {
  const { result: settings } = await getSettings();

  if (!settings) {
    throw new Error("Couldn't retrieve settings");
  }

  const {
    private: { automation: dict },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex md:items-center justify-center">
      <TelegramBot dict={dict} settings={settings}>
        <LatestOperations
          dict={dict["latest-operations"]}
          languageCode={settings.language}
        />
      </TelegramBot>
    </div>
  );
}
