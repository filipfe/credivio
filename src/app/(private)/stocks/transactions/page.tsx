import Add from "@/components/ui/cta/add";
import TransactionTable from "@/components/stocks/transactions-table";
import { getOwnStocks } from "@/lib/stocks/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { sort?: string; page?: string };
}) {
  const { results: ownStocks, count } = await getOwnStocks(searchParams);

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
