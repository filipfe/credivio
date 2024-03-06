import AddForm from "@/components/operation/form";
import { getSpecificOperation } from "@/lib/operation/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = searchParams;
  let income: Operation | null = null;
  if (id) {
    const { results } = await getSpecificOperation(id, "income");
    income = results[0];
  }
  {
    return (
      <div className="px-12 pt-8 pb-24 flex flex-col h-full">
        <h1 className="text-3xl">{income ? "Modyfikuj" : "Dodaj"} przychód</h1>
        <AddForm defaultValue={income} type="income" />
      </div>
    );
  }
}
