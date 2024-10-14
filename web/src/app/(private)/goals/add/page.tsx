import GoalForm from "@/components/goals/form";
import { getSettings } from "@/lib/general/actions";

export default async function Page() {
  const { result: settings } = await getSettings();

  if (!settings) {
    throw new Error("Couldn't retrieve settings");
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <GoalForm defaultCurrency={settings.currency} />
    </div>
  );
}
