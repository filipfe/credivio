"use client";

import { ADD_METHODS } from "@/const";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { CheckIcon, EyeIcon, PaperclipIcon } from "lucide-react";
import { ChangeEvent, Fragment, useState, useTransition } from "react";
import Papa from "papaparse";
import { addExpenses } from "@/lib/expenses/actions";
import chardet from "chardet";

export default function ExpenseForm() {
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<AddMethodKey>("csv");
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<Expense[]>([]);
  const [singleRecord, setSingleRecord] = useState<Expense>({
    title: "",
    issued_at: "",
    amount: "0",
    currency: "",
    description: "",
  });

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    const encoding = chardet.detect(Buffer.from(await file.arrayBuffer()));

    const reader = new FileReader();

    reader.onload = async (ev) => {
      if (!ev.target?.result) return;
      Papa.parse(ev.target.result as string, {
        skipEmptyLines: true,
        encoding: "UTF-8",
        complete: ({ data, errors }) => {
          if (errors.length > 0) return;
          const results: Expense[] = (data as string[][])
            .filter((item) => item[3][0] !== "+")
            .slice(1)
            .map((record) => {
              let [
                issued_at,
                currency_date,
                title,
                amount,
                currency,
                budget_after,
                description,
              ] = record;
              amount = amount.slice(1);
              budget_after = budget_after.slice(1);
              return {
                issued_at,
                currency_date,
                title,
                amount,
                currency,
                budget_after,
                description,
              };
            });
          setRecords(results);
        },
      });
    };
    reader.readAsText(file, encoding || "UTF-8");
  };

  const isPreviewHidden =
    method === "csv"
      ? !!fileName
      : Object.keys(singleRecord).some((key) => {
          const value = singleRecord[key as keyof Expense];
          return !!value && value !== "0";
        });

  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-8 mt-8">
      <form
        className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col"
        action={(e) =>
          startTransition(async () => {
            const { error } = await addExpenses(e);
          })
        }
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
        {method === "csv" ? (
          <label
            className="flex items-center gap-2 text-primary cursor-pointer opacity-80 hover:opacity-80 transition-opacity"
            htmlFor="csv-file"
          >
            <PaperclipIcon className="mt-0.5" size={16} />
            <span>{fileName || "Dodaj plik"}</span>
            <input
              type="file"
              id="csv-file"
              required
              className="opacity-0 -z-50 pointer-events-none absolute"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={onFileChange}
            />
          </label>
        ) : (
          <div className="grid grid-cols-2 gap-4 my-4">
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="title"
              label="Tytuł"
              placeholder="Wynagrodzenie"
              isRequired
              value={singleRecord.title}
              onChange={(e) =>
                setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="amount"
              label="Kwota"
              placeholder="3600"
              isRequired
              value={parseFloat(singleRecord.amount).toString()}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/\D/g, "");
                setSingleRecord((prev) => ({
                  ...prev,
                  amount: value,
                }));
              }}
            />
            <Autocomplete
              label="Waluta"
              placeholder="PLN"
              isClearable={false}
              isRequired
              value={singleRecord.currency}
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  currency: e.target.value,
                }))
              }
              inputProps={{
                classNames: {
                  inputWrapper: "!bg-light",
                },
              }}
            >
              <AutocompleteItem
                classNames={{
                  base: "!bg-white hover:!bg-light",
                }}
                key="usd"
              >
                USD
              </AutocompleteItem>
            </Autocomplete>
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="issued_at"
              label="Data uiszczenia"
              placeholder="24.01.2024"
              type="date"
              isRequired
              value={singleRecord.issued_at}
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  issued_at: e.target.value,
                }))
              }
            />
            <Textarea
              className="col-span-2"
              classNames={{ inputWrapper: "!bg-light" }}
              name="number"
              label="Opis"
              placeholder="Wynagrodzenie za luty"
              value={singleRecord.description}
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        )}
        <input type="hidden" name="method" value={method} />
        <input
          type="hidden"
          name="data"
          value={
            method === "csv"
              ? JSON.stringify(records)
              : JSON.stringify(singleRecord)
          }
        />
        <div className="flex-1 flex justify-end items-end gap-4">
          <div></div>
          <Button
            isDisabled={isPending}
            color="primary"
            type="submit"
            className="h-9 text-white"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <Fragment>
                <CheckIcon className="mt-0.5" size={16} /> Zapisz
              </Fragment>
            )}
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-lg px-10 py-8 flex flex-col gap-4">
        <h2 className="text-lg">Podgląd</h2>
        {isPreviewHidden ? (
          <div></div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 w-full self-center max-w-[16rem]">
            <EyeIcon size={48} strokeWidth={1} />
            <p className="text-sm">
              Wypełnij formularz, aby zobaczyć podgląd swoich wydatków
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
