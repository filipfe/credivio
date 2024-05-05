import AddForm from "@/components/stocks/form";
import { getAllStocks } from "@/lib/stocks/actions";

export default async function Page() {
  const { results: stocks } = await getAllStocks();
  return (
    <div className="sm:px-10 pt-4 pb-16 sm:py-8 flex flex-col h-full">
      <AddForm stocks={stocks} />
    </div>
  );
}
