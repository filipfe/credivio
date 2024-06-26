import GoalForm from "@/components/goals/form";
import { getDefaultCurrency } from "@/lib/settings/actions";

export default async function Page() {
  const { result: defaultCurrency, error } = await getDefaultCurrency();

  if (!defaultCurrency) {
    console.error("Couldn't retrieve default currency: ", error);
    throw new Error(error);
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <GoalForm defaultCurrency={defaultCurrency} />
    </div>
  );
}
