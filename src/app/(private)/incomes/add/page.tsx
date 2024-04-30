import AddForm from "@/components/operations/form";
import { getSpecificRow } from "@/lib/general/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = searchParams;
  let income: Operation | null = null;
  if (id) {
    const { results } = await getSpecificRow<Operation>(id, "income");
    income = results[0];
  }
  {
    return (
      <div className="sm:px-10 pt-4 pb-16 sm:py-8 flex flex-col h-full">
        <AddForm defaultValue={income} type="income" />
      </div>
    );
  }
}
