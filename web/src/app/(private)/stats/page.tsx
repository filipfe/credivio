import BalanceByMonth from "@/components/stats/balance-by-month";
import ExpensesByLabelChart from "@/components/stats/expenses-by-label-chart";
import { getPreferences } from "@/lib/settings/actions";

export default async function Page() {
  const { result: preferences, error } = await getPreferences();

  if (!preferences) {
    console.error(error);
    throw new Error("Couldn't retrieve preferences");
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-6">
      <ExpensesByLabelChart preferences={preferences} />
      <BalanceByMonth preferences={preferences} />
    </div>
  );
}
