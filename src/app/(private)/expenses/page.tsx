import Add from "@/components/operation/cta/add";
import OperationList from "@/components/operation/list";
import OperationTable from "@/components/operation/table";
import { getOperations } from "@/lib/operation/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { sort?: string; page?: string };
}) {
  const { results: expenses, count } = await getOperations(
    "expense",
    searchParams
  );
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full gap-8">
      <OperationTable
        title="Wydatki"
        type="expense"
        operations={expenses}
        count={count || 0}
      />
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
