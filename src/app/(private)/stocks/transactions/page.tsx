import Add from "@/components/operation/cta/add";
import TransactionTable from "@/components/stocks/transactions-table";
import { getOwnStocks } from "@/lib/stocks/actions";

export default async function Page() {
  const { results: ownStocks } = await getOwnStocks();
  return (
    <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12 mb-12">
      <div className="flex items-center gap-4 justify-between mb-2">
        <h2 className="text-lg">Moje transakcje</h2>
        <Add type="stock" />
      </div>
      <TransactionTable stocks={ownStocks} />
    </section>
  );
}
