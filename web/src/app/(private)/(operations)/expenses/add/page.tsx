import AddForm from "@/components/operations/form";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function Page() {
  const settings = await getSettings();

  const {
    private: {
      operations: {
        "operation-table": { dropdown: dict },
      },
    },
  } = await getDictionary(settings.language);

  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <AddForm dict={dict} type="expense" defaultCurrency={settings.currency} />
    </div>
  );
}
