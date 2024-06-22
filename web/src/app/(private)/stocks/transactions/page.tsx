import Loader from "@/components/stocks/loader";
import TransactionTable from "@/components/stocks/transactions-table";
import { getOwnRows } from "@/lib/general/actions";
import { Suspense } from "react";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6">
      <Suspense fallback={<Loader />}>
        <Transactions searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Transactions({ searchParams }: { searchParams: SearchParams }) {
  const { results: ownStocks, count } = await getOwnRows<StockTransaction>(
    "stock",
    searchParams
  );

  return (
    <TransactionTable
      title={"Moje transakcje"}
      rows={ownStocks}
      count={count || 0}
      type="stock"
    />
  );
}
