import Add from "@/components/operation/add";
import OperationList from "@/components/operation/list";
import { getOperations } from "@/lib/operation/actions";

export default async function Page() {
  const { results: incomes } = await getOperations("income");
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl">Przychody</h1>
        {incomes.length > 0 && <Add type="income" />}
      </div>
      {incomes.length > 0 ? (
        <OperationList operations={incomes} type="income" />
      ) : (
        <div className="text-center flex-1 justify-center flex flex-col items-center gap-4">
          <p>Nie masz jeszcze żadnych przychodów!</p>
          <Add type="income" />
        </div>
      )}
    </div>
  );
}
