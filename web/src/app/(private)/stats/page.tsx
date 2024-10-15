import Providers from "./providers";
import Filters from "@/components/stats/filters";
import ExpensesByLabel from "@/components/stats/expenses-by-label";
import BalanceByMonth from "@/components/stats/balance-by-month";
import StatsList from "@/components/stats/operations-stats/stats-list";
import OperationsByDayOfWeek from "@/components/stats/operations-by-day-of-week";
import { getSettings } from "@/lib/general/actions";

export default async function Page() {
  const settings = await getSettings();

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col lg:grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      <Providers settings={settings}>
        <Filters />
        <StatsList />
        <BalanceByMonth />
        <OperationsByDayOfWeek />
        <ExpensesByLabel />
      </Providers>
    </div>
  );
}
