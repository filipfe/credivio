import OperationTable from "@/components/operation/table";
import { getOwnRows } from "@/lib/general/actions";
import { getLabels } from "@/lib/operation/actions";
import Block from "@/components/ui/block";
import Stat from "@/components/dashboard/stats/ref";

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
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 lg:grid grid-cols-4 lg:grid-rows-[max-content_1fr]">
      {expenses.length > 0 && (
        <div className="row-span-2 col-span-2 flex items-stretch">
          <OperationTable
            title="Wydatki"
            type="expense"
            rows={expenses}
            count={count || 0}
            labels={labels}
          />
        </div>
      )}
      <div className="col-[3/4]">
        <Stat
          title="Dzisiaj"
          description=""
          currency="PLN"
          stat={{ amount: 124, difference: 42, is_positive: true }}
        />
      </div>
      <div className="col-[4/5]">
        <Stat
          title="W tym miesiącu"
          description=""
          currency="PLN"
          stat={{ amount: 124, difference: 42, is_positive: true }}
        />
      </div>
    </div>
  );
}
