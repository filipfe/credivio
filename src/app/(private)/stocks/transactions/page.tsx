import TransactionTable from "@/components/stocks/transactions-table";
import { getOwnRows } from "@/lib/general/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { sort?: string; page?: string; search?: string };
}) {
  const { results: ownStocks, count } = await getOwnRows<StockTransaction>(
    "stock",
    searchParams
  );

  return (
    <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12 mb-12">
      <TransactionTable
        title={"Moje transakcje"}
        rows={ownStocks}
        count={count || 0}
      />
    </section>
  );
}
