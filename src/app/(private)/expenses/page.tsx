import OperationTable from "@/components/operation/table";
import { getOwnRows } from "@/lib/general/actions";
import { getLabels } from "@/lib/operation/actions";
import Block from "@/components/ui/block";

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
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-8 lg:grid grid-cols-2">
      {expenses.length > 0 && (
        <OperationTable
          title="Wydatki"
          type="expense"
          rows={expenses}
          count={count || 0}
          labels={labels}
        />
      )}
      <Block>
        <div></div>
      </Block>
    </div>
  );
}
