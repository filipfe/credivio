"use client";

import { ADD_METHODS, CURRENCIES } from "@/const";
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
import {
  CheckIcon,
  EyeIcon,
  HelpCircleIcon,
  PaperclipIcon,
  PlusIcon,
} from "lucide-react";
import { ChangeEvent, Fragment, useState, useTransition } from "react";
import parseCSV from "@/utils/operation/parse-csv";
import { addOperations } from "@/lib/operation/actions";
import OperationTable from "./table";

const defaultRecord = {
  title: "",
  issued_at: new Date().toISOString().substring(0, 10),
  amount: "0",
  currency: "PLN",
  description: "",
};

const formatter = (data: string[][]) => {
  return data.map((record) => {
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
};

export default function AddForm({ type }: { type: OperationType }) {
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<AddMethodKey>("manual");
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<Operation[]>([]);
  const [singleRecord, setSingleRecord] = useState<Operation>(defaultRecord);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    await parseCSV(
      file,
      (results) => setRecords((prev) => [...prev, ...formatter(results)]),
      {
        type,
      }
    );
  };

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecords((prev) => [...prev, singleRecord]);
    setSingleRecord(defaultRecord);
  };

  return (
    <div className="flex flex-col xl:grid grid-cols-2 gap-8 mt-8">
      <form
        onSubmit={addRecord}
        className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col"
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
                let { value } = e.target;
                if (value === "")
                  return setSingleRecord((prev) => ({ ...prev, amount: "0" }));
                value = value.replace(/\D/g, "");
                setSingleRecord((prev) => ({
                  ...prev,
                  amount: value,
                }));
              }}
            />
            <Autocomplete
              name="currency"
              label="Waluta"
              placeholder="PLN"
              isClearable={false}
              isRequired
              value={singleRecord.currency}
              selectedKey={singleRecord.currency}
              onSelectionChange={(curr) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  currency: curr.toString(),
                }))
              }
              inputProps={{
                classNames: {
                  inputWrapper: "!bg-light",
                },
              }}
            >
              {CURRENCIES.map((curr) => (
                <AutocompleteItem
                  value={curr}
                  classNames={{
                    base: "!bg-white hover:!bg-light",
                  }}
                  key={curr}
                >
                  {curr}
                </AutocompleteItem>
              ))}
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
              name="description"
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
        <div className="flex-1 flex justify-end items-end gap-4">
          <Button
            color="secondary"
            type="submit"
            className="h-9 text-white"
            isIconOnly
          >
            <PlusIcon className="mt-0.5" size={16} />
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-lg px-10 py-8 flex flex-col gap-4">
        <h2 className="text-lg">Podgląd</h2>
        <OperationTable operations={records} count={records.length} viewOnly />
        <form
          className="flex flex-col"
          action={(e) =>
            startTransition(async () => {
              const { error } = await addOperations(e);
            })
          }
        >
          <Button
            isDisabled={isPending || records.length === 0}
            color="primary"
            type="submit"
            className="h-9 w-24 text-white self-end"
          >
            {isPending ? (
              <Spinner color="white" size="sm" />
            ) : (
              <Fragment>
                <CheckIcon className="mt-0.5" size={16} /> Zapisz
              </Fragment>
            )}
          </Button>
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="data" value={JSON.stringify(records)} />
        </form>
      </div>
    </div>
  );
}
