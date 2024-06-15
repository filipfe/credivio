"use client";

import { CURRENCIES } from "@/const";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Spinner,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import {
  CheckIcon,
  FileSpreadsheetIcon,
  HelpCircleIcon,
  PaperclipIcon,
  PlusIcon,
  ScanTextIcon,
  WrenchIcon,
} from "lucide-react";
import {
  ChangeEvent,
  Fragment,
  useEffect,
  useState,
  useTransition,
} from "react";
import parseCSV from "@/utils/operation/parse-csv";
import { addOperations, getLabels } from "@/lib/operations/actions";
import OperationTable from "./table";
import formatAmount from "@/utils/operation/format-amount";
import operationFormatter from "@/utils/formatters/operations";
import { v4 } from "uuid";
import UniversalSelect from "../ui/universal-select";
import Block from "../ui/block";
import Scan from "./inputs/scan";

const defaultRecord: Omit<Operation, "id"> = {
  title: "",
  issued_at: new Date().toISOString().substring(0, 10),
  amount: "",
  description: "",
  currency: "",
};

export default function AddForm({
  type,
  defaultCurrency,
}: {
  type: OperationType;
  defaultCurrency: string;
}) {
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<Operation[]>([]);
  const [singleRecord, setSingleRecord] = useState<Operation>({
    ...defaultRecord,
    id: v4(),
    currency: defaultCurrency,
  });
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
    setSingleRecord((prev) => ({
      ...defaultRecord,
      id: v4(),
      currency: prev.currency,
    }));
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
        <Block title="Dane">
          <Tabs radius="lg">
            <Tab
              key="manual"
              title={
                <div className="flex items-center gap-2">
                  <WrenchIcon size={16} opacity={0.8} />
                  <span>Ręcznie</span>
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-4">
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
                <UniversalSelect
                  name="currency"
                  label="Waluta"
                  selectedKeys={[singleRecord.currency]}
                  elements={CURRENCIES}
                  onChange={(e) => {
                    setSingleRecord((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }));
                  }}
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
            </Tab>
            <Tab
              key="csv"
              title={
                <div className="flex items-center gap-2">
                  <FileSpreadsheetIcon size={16} opacity={0.8} />
                  <span>Import CSV</span>
                </div>
              }
            >
              <Button
                as="label"
                variant="light"
                className="bg-light"
                disableRipple
                fullWidth
                htmlFor="csv-file"
              >
                <PaperclipIcon className="mt-0.5" size={16} />
                {fileName || "Dodaj plik"}
                <input
                  type="file"
                  id="csv-file"
                  required
                  className="sr-only"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={onFileChange}
                />
              </Button>
            </Tab>
            <Tab
              key="scan"
              title={
                <div className="flex items-center gap-2">
                  <ScanTextIcon size={16} opacity={0.8} />
                  <span>Skan dokumentu</span>
                </div>
              }
            >
              <Scan setRecords={setRecords} />
            </Tab>
          </Tabs>
          <div className="flex-1 flex justify-end items-end gap-4">
            <Button color="secondary" type="submit" className="h-9 text-white">
              <PlusIcon className="mt-0.5" size={16} />
              Dodaj
            </Button>
          </div>
        </Block>
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
          className="flex-1 relative"
          action={(e) =>
            startTransition(async () => {
              const { error } = await addOperations(e);
            })
          }
        >
          <div className="flex flex-col gap-8 justify-end h-full">
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
          </div>
        </form>
      </OperationTable>
    </div>
  );
}
