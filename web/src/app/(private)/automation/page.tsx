import LatestOperations from "@/components/automation/latest-operations";
import TelegramBot from "@/components/automation/telegram-bot";
import { getPreferences } from "@/lib/settings/actions";

export default async function Page() {
  const { result: preferences, error } = await getPreferences();

  if (!preferences) {
    console.error(error);
    throw new Error("Couldn't retrieve preferences");
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex md:items-center justify-center">
      <TelegramBot preferences={preferences}>
        <LatestOperations preferences={preferences} />
      </TelegramBot>
    </div>
  );
}
