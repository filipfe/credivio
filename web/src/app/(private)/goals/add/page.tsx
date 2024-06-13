import GoalForm from "@/components/goals/form";
import { getDefaultCurrency } from "@/lib/settings/actions";

export default async function Page() {
  const defaultCurrency = await getDefaultCurrency();

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <GoalForm defaultCurrency={defaultCurrency} />
    </div>
  );
}
