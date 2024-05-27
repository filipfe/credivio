import GoalForm from "@/components/goals/form";
import { getDefaultCurrency } from "@/lib/operation/actions";

export default async function Page() {
  const defaultCurrency = await getDefaultCurrency();

  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <GoalForm defaultCurrency={defaultCurrency} />
    </div>
  );
}
