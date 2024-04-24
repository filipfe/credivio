import IncomeTable from "@/components/operation/table";
import Block from "@/components/ui/block";
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
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-8 lg:grid grid-cols-2">
      {incomes.length > 0 && (
        <IncomeTable
          title="Przychody"
          rows={incomes}
          count={count || 0}
          type="income"
        />
      )}
      <Block>
        <div></div>
      </Block>
    </div>
  );
}
