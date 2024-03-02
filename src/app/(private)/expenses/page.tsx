import Add from "@/components/operation/add";
import OperationList from "@/components/operation/list";
import { getExpenses } from "@/lib/expenses/actions";

export default async function Page() {
  const { results: expenses } = await getExpenses();
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl">Wydatki</h1>
        {expenses.length > 0 && <Add type="expense" />}
      </div>
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
