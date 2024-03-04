import IncomeTable from "@/components/income/table";
import Add from "@/components/operation/add";
import { getIncomes } from "@/lib/incomes/actions";
import { SortDescriptor } from "@nextui-org/table";
import { redirect } from "next/navigation";

type Props = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page(props: Props) {
  const { results: incomes, count } = await getIncomes(
    props.searchParams.sort?.toString(),
    Number(props.searchParams.page)
  );

  return (
    <div className="px-12 pt-8 pb-24">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl">Przychód</h1>
        <Add type="income" />
      </div>
      <IncomeTable
        incomes={incomes}
        count={count || 0}
      />
    </div>
  );
}
