import AddForm from "@/components/operations/form";
import { getDefaultCurrency } from "@/lib/settings/actions";

export default async function Page() {
  const defaultCurrency = await getDefaultCurrency();

  return (
    <div className="sm:px-10 pt-4 pb-16 sm:py-8 flex flex-col h-full">
      <AddForm type="expense" defaultCurrency={defaultCurrency} />
    </div>
  );
}
