"use client";

import { ADD_METHODS, TRANSACTION_TYPES } from "@/const";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { CheckIcon, PaperclipIcon, PlusIcon } from "lucide-react";
import {
  ChangeEvent,
  Fragment,
  useEffect,
  useState,
  useTransition,
} from "react";
import parseCSV from "@/utils/operation/parse-csv";
import { addStocks } from "@/lib/stocks/actions";
import TransactionTable from "./transactions-table";
import { v4 } from "uuid";
import stocksFormatter from "@/utils/formatters/stocks";

const defaultRecord: Omit<StockTransaction, "id"> = {
  symbol: "",
  commission: "0",
  transaction_type: "buy",
  value: 0,
  price: "",
  issued_at: new Date().toISOString().substring(0, 10),
  quantity: "",
  currency: "PLN",
};

export default function Form({
  stocks,
  defaultValue,
}: {
  stocks: Stock[];
  defaultValue?: StockTransaction | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<AddMethodKey>("manual");
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<StockTransaction[]>(
    defaultValue ? [defaultValue] : []
  );
  const [singleRecord, setSingleRecord] = useState<StockTransaction>(
    defaultValue || { ...defaultRecord, id: v4() }
  );

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    await parseCSV(file, (results) => setRecords(stocksFormatter(results)));
  };

  const addRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords((prev) => [...prev, singleRecord]);
    setSingleRecord({ ...defaultRecord, id: v4() });
  };

  const value =
    parseFloat(singleRecord.price) * parseInt(singleRecord.quantity);

  return (
    <div className="flex flex-col xl:grid grid-cols-2 gap-8 mt-8">
      <form
        className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col"
        onSubmit={addRecord}
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
            <Autocomplete
              label="Walor"
              placeholder="PKNORLEN"
              isClearable={false}
              isRequired
              value={singleRecord.symbol}
              selectedKey={singleRecord.symbol}
              defaultItems={stocks}
              onSelectionChange={(symb) =>
                symb &&
                setSingleRecord((prev) => ({
                  ...prev,
                  symbol: symb.toString(),
                }))
              }
              inputProps={{ classNames: { inputWrapper: "!bg-light" } }}
            >
              {(stock) => (
                <AutocompleteItem
                  textValue={stock._symbol}
                  classNames={{
                    base: "!bg-white hover:!bg-light",
                  }}
                  key={stock._symbol}
                >
                  {stock._symbol}{" "}
                  <span className="text-secondary">{stock._symbol_short}</span>
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Select
              classNames={{ trigger: "!bg-light" }}
              name="transaction_type"
              label="Typ transakcji"
              isRequired
              value={singleRecord.transaction_type}
              selectedKeys={[singleRecord.transaction_type]}
              onChange={(e) =>
                setSingleRecord((prev) => ({
                  ...prev,
                  transaction_type: e.target.value as "sell" | "buy",
                }))
              }
            >
              {TRANSACTION_TYPES.map(({ value, name }) => (
                <SelectItem value={value} key={value}>
                  {name}
                </SelectItem>
              ))}
            </Select>
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="quantity"
              label="Ilość"
              placeholder="124"
              isRequired
              value={singleRecord.quantity}
              onBlur={(e) => {
                const value = parseInt(singleRecord.quantity);

                !isNaN(value) &&
                  setSingleRecord((prev) => ({
                    ...prev,
                    quantity: value === 0 ? "" : value.toString(),
                  }));
              }}
              onChange={(e) => {
                let { value } = e.target;

                value = value.match(/[0-9]*/g)![0];

                setSingleRecord((prev) => ({
                  ...prev,
                  quantity: value,
                }));
              }}
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="price"
              label="Cena"
              placeholder="0.00"
              isRequired
              value={singleRecord.price.toString()}
              onBlur={(e) => {
                const value = parseFloat(singleRecord.price);

                !isNaN(value) &&
                  setSingleRecord((prev) => ({
                    ...prev,
                    price: value == 0 ? "" : value.toString(),
                  }));
              }}
              onChange={(e) => {
                let { value } = e.target;

                value = value
                  .match(/([0-9]*[\.|\,]{0,1}[0-9]{0,2})/g)![0]
                  .replace(",", ".");

                value = value.startsWith(".") ? "0" + value : value;

                setSingleRecord((prev) => ({
                  ...prev,
                  price: value,
                }));
              }}
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="commission"
              label="Prowizja"
              placeholder="0.00"
              isDisabled={value <= 0}
              value={singleRecord.commission}
              onBlur={(e) => {
                if (singleRecord.commission == "") {
                  return setSingleRecord((prev) => ({
                    ...prev,
                    commission: "0",
                  }));
                }

                const float = parseFloat(singleRecord.commission);
                !isNaN(float) &&
                  setSingleRecord((prev) => ({
                    ...prev,
                    commission: float.toString(),
                  }));
              }}
              onChange={(e) => {
                let { value } = e.target;

                value = value
                  .match(/([0-9]*[\.|\,]{0,1}[0-9]{0,2})/g)![0]
                  .replace(",", ".");

                value = value.startsWith(".") ? "0" + value : value;

                setSingleRecord((prev) => ({
                  ...prev,
                  commission: value,
                }));
              }}
              onFocus={(e) => {
                if (singleRecord.commission == "0") {
                  setSingleRecord((prev) => ({
                    ...prev,
                    commission: "",
                  }));
                }
              }}
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="issued_at"
              label="Data zawarcia"
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
        <TransactionTable
          title="Podgląd"
          rows={records}
          count={records.length}
          viewOnly={{
            setRows: setRecords,
          }}
        />
        <form
          className="flex flex-col"
          action={(e) =>
            startTransition(async () => {
              const { error } = await addStocks(e);
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
          <input type="hidden" name="data" value={JSON.stringify(records)} />
        </form>
      </div>
    </div>
  );
}
