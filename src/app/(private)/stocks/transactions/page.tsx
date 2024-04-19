import Loader from "@/components/stocks/loader";
import TransactionTable from "@/components/stocks/transactions-table";
import { getOwnRows } from "@/lib/general/actions";
import { Suspense } from "react";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12 mb-12">
      <Suspense fallback={<Loader />}>
        <Transactions searchParams={searchParams} />
      </Suspense>
    </section>
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
    />
  );
}
