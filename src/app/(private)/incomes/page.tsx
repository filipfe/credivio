import IncomeTable from "@/components/operation/table";
import Add from "@/components/operation/cta/add";
import OperationList from "@/components/operation/list";
import { getOperations } from "@/lib/operation/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { sort?: string; page?: string };
}) {
  const { results: incomes, count } = await getOperations(
    "income",
    searchParams
  );
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl">Przychody</h1>
        {incomes.length > 0 && <Add type="income" />}
      </div>
      <IncomeTable operations={incomes} count={count || 0} />
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
