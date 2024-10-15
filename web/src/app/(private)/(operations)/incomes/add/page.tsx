import AddForm from "@/components/operations/form";
import { getSettings } from "@/lib/general/actions";

export default async function Page() {
  const settings = await getSettings();

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <AddForm type="income" defaultCurrency={settings.currency} />
    </div>
  );
}
