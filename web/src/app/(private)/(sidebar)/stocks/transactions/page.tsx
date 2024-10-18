// import TransactionTable from "@/components/stocks/transactions-table";
import { getOwnStocks } from "@/lib/stocks/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { results: ownStocks, count } = await getOwnStocks(searchParams);
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6">
      {/* <TransactionTable
        title={"Moje transakcje"}
        rows={ownStocks || []}
        count={count || 0}
        type="stock"
      /> */}
    </div>
  );
}
