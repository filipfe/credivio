import AddForm from "@/components/stocks/form";
import { getAllStocks } from "@/lib/stocks/actions";

export default async function Page() {
  const { results: stocks } = await getAllStocks();
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <h1 className="text-3xl">Dodaj transakcję</h1>
      <AddForm stocks={stocks} />
    </div>
  );
}
