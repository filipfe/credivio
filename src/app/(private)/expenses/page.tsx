import Add from "@/components/ui/add";
import { getExpenses } from "@/lib/expenses/actions";

export default async function Page() {
  const { results: expenses } = await getExpenses();
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl">Wydatki</h1>
        {expenses.length > 0 && <Add type="expense" />}
      </div>
      {expenses.length > 0 ? (
        <div className="grid grid-cols-4 gap-y-10 gap-x-6 mt-8"></div>
      ) : (
        <div className="text-center flex-1 justify-center flex flex-col items-center gap-4">
          <p>Nie masz jeszcze żadnych wydatków!</p>
          <Add type="expense" />
        </div>
      )}
    </div>
  );
}
