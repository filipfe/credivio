import Add from "@/components/ui/cta/add";
import OperationList from "@/components/operation/list";
import OperationTable from "@/components/operation/table";
import { getOwnRows } from "@/lib/general/actions";
import { getLabels } from "@/lib/operation/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { results: expenses, count } = await getOwnRows<Operation>(
    "expense",
    searchParams
  );
  const { results: labels } = await getLabels();
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full gap-8">
      {expenses.length > 0 && (
        <OperationTable
          title="Wydatki"
          type="expense"
          rows={expenses}
          count={count || 0}
          labels={labels}
        />
      )}
      {expenses.length > 0 ? (
        <OperationList operations={expenses} type="expense" />
      ) : (
        <div className="text-center flex-1 justify-center flex flex-col items-center gap-4">
          <p>Nie masz jeszcze żadnych wydatków!</p>
          <Add type="expense" />
        </div>
      )}
    </div>
  );
}
