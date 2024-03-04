import Stat from "@/components/dashboard/stat";
import { getExpenses } from "@/lib/expenses/actions";
import { CoinsIcon, SettingsIcon, Wallet2Icon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { results: expenses } = await getExpenses();
  return (
    <div className="px-12 py-8 grid grid-cols-6 gap-6">
      {/* <h2 className="text-3xl col-span-6">Budżet</h2>
      <Budget amount="4162,92" currency="PLN" />
      <Budget amount="819,23" currency="USD" />
      <h2 className="text-3xl col-span-6">Statystyki</h2> */}
      <Stat
        title="Przychód"
        amount="260,66"
        currency="PLN"
        description=""
        previous={{ amount: "100" }}
      />
      <Stat
        title="Wydatki"
        amount={expenses
          .reduce((prev, curr) => prev + parseFloat(curr.amount), 0)
          .toFixed(2)
          .toString()}
        currency="PLN"
        description=""
        previous={{ amount: "240" }}
      />
      <Stat
        title="Zysk"
        amount="260,89"
        currency="PLN"
        description=""
        previous={{ amount: "100" }}
      />
      <div className="col-span-3 bg-white rounded-lg py-8 px-10"></div>
      <div className="col-span-3 bg-white rounded-lg py-8 px-10"></div>
      <h2 className="text-3xl col-span-6">Skróty</h2>
      <Link
        href="/income/add"
        className="bg-white rounded-lg py-8 px-10 flex flex-col items-center gap-4"
      >
        <CoinsIcon size={48} strokeWidth={1} />
        <p className="font-medium text-center">Dodaj przychód</p>
      </Link>
      <Link
        href="/expenses/add"
        className="bg-white rounded-lg py-8 px-10 flex flex-col items-center gap-4"
      >
        <Wallet2Icon size={48} strokeWidth={1} />
        <p className="font-medium text-center">Dodaj wydatek</p>
      </Link>
      <Link
        href="/settings"
        className="bg-white rounded-lg py-8 px-10 flex flex-col items-center gap-4"
      >
        <SettingsIcon size={48} strokeWidth={1} />
        <p className="font-medium text-center">Zmień ustawienia</p>
      </Link>
    </div>
  );
}
