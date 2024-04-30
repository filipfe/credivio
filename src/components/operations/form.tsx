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
  Tooltip,
} from "@nextui-org/react";
import {
  CheckIcon,
  HelpCircleIcon,
  PaperclipIcon,
  PlusIcon,
} from "lucide-react";
import {
  ChangeEvent,
  Fragment,
  useEffect,
  useState,
  useTransition,
} from "react";
import parseCSV from "@/utils/operation/parse-csv";
import { addOperations, getLabels } from "@/lib/operation/actions";
import OperationTable from "./table";
import formatAmount from "@/utils/operation/format-amount";
import CurrencySelect from "../ui/currency-select";
import operationFormatter from "@/utils/formatters/operations";
import { v4 } from "uuid";

const defaultRecord: Omit<Operation, "id"> = {
  title: "",
  issued_at: new Date().toISOString().substring(0, 10),
  amount: "",
  currency: "PLN",
  description: "",
};

export default function AddForm({
  type,
  defaultValue,
}: {
  type: OperationType;
  defaultValue?: Operation | null;
}) {
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<AddMethodKey>("manual");
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<Operation[]>(
    defaultValue ? [defaultValue] : []
  );
  const [singleRecord, setSingleRecord] = useState<Operation>(
    defaultValue || { ...defaultRecord, id: v4() }
  );
  const [labels, setLabels] = useState<Label[]>([]);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    await parseCSV(
      file,
      (results) =>
        setRecords((prev) => [...prev, ...operationFormatter(results)]),
      {
        type,
      }
    );
  };

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecords((prev) => [...prev, singleRecord]);
    setSingleRecord({ ...defaultRecord, id: v4() });
  };

  useEffect(() => {
    if (records.length === 0) return;
    startTransition(async () => {
      const { results } = await getLabels();
      setLabels(results);
    });
  }, [records]);

  return (
    <div className="flex flex-col xl:grid grid-cols-2 gap-4 sm:gap-8">
      <form onSubmit={addRecord}>
        <div className="bg-white rounded-lg px-6 sm:px-10 py-6 sm:py-8 gap-4 flex flex-col">
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
                  setSingleRecord((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              <Input
                classNames={{ inputWrapper: "!bg-light" }}
                name="amount"
                label="Kwota"
                placeholder="0.00"
                isRequired
                value={singleRecord.amount}
                onBlur={(e) => {
                  const value = parseFloat(singleRecord.amount);

                  !isNaN(value) &&
                    setSingleRecord((prev) => ({
                      ...prev,
                      amount: value == 0 ? "" : value.toString(),
                    }));
                }}
                onChange={(e) =>
                  setSingleRecord((prev) => ({
                    ...prev,
                    amount: formatAmount(e.target.value),
                  }))
                }
              />
              <CurrencySelect
                value={singleRecord.currency}
                selectedKey={singleRecord.currency}
                onSelectionChange={(curr) =>
                  setSingleRecord((prev) => ({
                    ...prev,
                    currency: curr ? curr.toString() : defaultRecord.currency,
                  }))
                }
              />
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
        </div>
      </form>
      <OperationTable
        title="Podgląd"
        rows={records}
        count={records.length}
        viewOnly={{
          setRows: setRecords,
        }}
      >
        <form
          className="flex flex-col gap-8"
          action={(e) =>
            startTransition(async () => {
              const { error } = await addOperations(e);
            })
          }
        >
          {type === "expense" && (
            <div className="relative flex items-center">
              <Autocomplete
                name="label"
                label="Etykieta"
                placeholder="Jedzenie"
                isClearable={false}
                allowsCustomValue
                allowsEmptyCollection={false}
                isLoading={isPending}
                isDisabled={records.length === 0}
                value={label}
                inputProps={{
                  classNames: {
                    inputWrapper: "!bg-light",
                  },
                }}
                maxLength={48}
                showScrollIndicators
                onSelectionChange={(key) => setLabel(key.toString())}
              >
                {labels.map((label) => (
                  <AutocompleteItem
                    value={label.name}
                    textValue={label.name}
                    classNames={{
                      base: "!bg-white hover:!bg-light",
                    }}
                    key={label.name}
                  >
                    {label.name}{" "}
                    <span className="text-font/80">{`(${label.count})`}</span>
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              <div className="absolute left-[3.7rem] top-[11px]">
                <Tooltip
                  isDisabled={records.length === 0}
                  size="sm"
                  content="Dodaj etykietę, aby pogrupować operacje"
                >
                  <HelpCircleIcon size={12} className="text-primary" />
                </Tooltip>
              </div>
            </div>
          )}
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
      </OperationTable>
    </div>
  );
}
