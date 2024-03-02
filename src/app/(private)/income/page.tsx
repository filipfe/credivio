"use client";

import AddIncome from "@/components/income/add";
import IncomeTable from "@/components/income/table";

export default function Page() {
  return (
    <div className="px-12 pt-8 pb-24">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl">Przychód</h1>
        <AddIncome />
      </div>
      <IncomeTable />
    </div>
  );
}
