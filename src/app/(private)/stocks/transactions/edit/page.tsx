import Form from "@/components/stocks/form";
import AddForm from "@/components/stocks/form";
import { getSpecificRow } from "@/lib/general/actions";
import { getAllStocks } from "@/lib/stocks/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = searchParams;
  let stock: StockTransaction | null = null;
  if (id) {
    const { results } = await getSpecificRow<StockTransaction>(id, "stock");
    stock = results[0];
  }
  const { results: stocks } = await getAllStocks();
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <h1 className="text-3xl">Modyfikuj transakcję</h1>
      <Form stocks={stocks} defaultValue={stock} />
    </div>
  );
}
