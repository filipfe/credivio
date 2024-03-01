"use client";

import { ADD_METHODS } from "@/const";
import { Button, Radio, RadioGroup } from "@nextui-org/react";
import { PaperclipIcon, PlusIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import { addExpenses } from "@/lib/expenses/actions";

export default function ExpenseForm() {
  const [method, setMethod] = useState<AddMethodKey>("csv");
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<string[][]>([]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    Papa.parse(file as any, {
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) return;
        // const results = (data as string[][]).map((record) => {
        //   const [
        //     issued_at,
        //     currency_date,
        //     title,
        //     amount,
        //     currency,
        //     budget_after,
        //     description,
        //   ] = record;
        //   return {
        //     issued_at,
        //     currency_date,
        //     title,
        //     amount,
        //     currency,
        //     budget_after,
        //     description,
        //   };
        // });
        setRecords(data as string[][]);
      },
    });
  };

  console.log(records);
  return (
    <div className="grid grid-cols-2 gap-8 flex-1 mt-8">
      <form
        className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col"
        action={addExpenses}
      >
        <h2 className="text-lg">Dane</h2>
        <RadioGroup
          label="Wybierz sposób"
          value={method}
          onChange={(e) => setMethod(e.target.value as AddMethodKey)}
        >
          {ADD_METHODS.map(({ title, type }) => (
            <Radio value={type} key={type}>
              {title}
            </Radio>
          ))}
        </RadioGroup>
        {method === "csv" && (
          <label
            className="flex items-center gap-2 text-primary cursor-pointer opacity-80 hover:opacity-80 transition-opacity"
            htmlFor="csv-file"
          >
            <PaperclipIcon className="mt-0.5" size={16} />
            <span>{fileName || "Dodaj plik"}</span>
            <input
              type="file"
              id="csv-file"
              name="csv-file"
              className="opacity-0 -z-50 pointer-events-none absolute"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={onFileChange}
            />
          </label>
        )}
        <div className="flex-1 flex justify-end items-end gap-4">
          <div></div>
          <Button color="primary" className="h-9 text-white">
            <PlusIcon className="mt-0.5" size={16} /> Dodaj
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-lg px-10 py-8 space-y-4">
        <h2 className="text-lg">Podgląd</h2>
      </div>
    </div>
  );
}
