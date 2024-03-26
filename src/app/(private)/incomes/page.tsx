import IncomeTable from "@/components/operation/table";
import Add from "@/components/ui/cta/add";
import OperationList from "@/components/operation/list";
import { getOwnRows } from "@/lib/general/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { sort?: string; page?: string; search?: string };
}) {
  const { results: incomes, count } = await getOwnRows<Operation>(
    "income",
    searchParams
  );
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full gap-8">
      {incomes.length > 0 && (
        <IncomeTable
          title="Przychody"
          rows={incomes}
          count={count || 0}
          type="income"
        />
      )}
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
