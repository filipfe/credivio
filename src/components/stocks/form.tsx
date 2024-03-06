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
import { CheckIcon, PaperclipIcon } from "lucide-react";
import { ChangeEvent, Fragment, useState, useTransition } from "react";
import parseCSV from "@/utils/operation/parse-csv";
import { addStocks } from "@/lib/stocks/actions";

const formatter = (data: string[][]): Omit<StockTransaction, "id">[] => {
  return data
    .map((record) => {
      let [
        issued_at,
        symbol,
        ,
        currency,
        transaction_type,
        quantity,
        price,
        ,
        value,
        ,
        commission,
      ] = record;
      price = price.replace(",", ".");
      commission = commission.replace(",", ".");
      value = value.replace(",", ".");
      const result = {
        issued_at,
        symbol,
        transaction_type:
          transaction_type === "Kupno" ? "buy" : ("sell" as "buy" | "sell"),
        quantity: parseInt(quantity),
        value: parseFloat(value),
        price: parseFloat(price),
        commission: parseFloat(commission),
        currency,
      };
      return result;
    })
    .filter((item) => item.symbol);
};

export default function AddForm({ stocks }: { stocks: Stock[] }) {
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<AddMethodKey>("manual");
  const [fileName, setFileName] = useState("");
  const [records, setRecords] = useState<Omit<StockTransaction, "id">[]>([]);
  const [singleRecord, setSingleRecord] = useState<
    Omit<StockTransaction, "id">
  >({
    symbol: "",
    commission: 0,
    transaction_type: "buy",
    value: 0,
    price: 0,
    issued_at: new Date().toISOString().substring(0, 10),
    quantity: 1,
    currency: "PLN",
  });

  const { currency } = singleRecord;

  const numberFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  });

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setFileName(file.name);
    await parseCSV(file, (results) => setRecords(formatter(results)));
  };

  return (
    <div className="flex flex-col xl:grid grid-cols-2 gap-8 mt-8">
      <form
        className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col"
        action={(e) =>
          startTransition(async () => {
            const { error } = await addStocks(e);
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
              inputProps={{
                classNames: {
                  inputWrapper: "!bg-light",
                },
              }}
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
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="issued_at"
              label="Data zakupu"
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
              name="amount"
              label="Ilość"
              placeholder="4"
              isRequired
              value={singleRecord.quantity.toString()}
              onChange={(e) => {
                let { value } = e.target;
                if (value === "")
                  return setSingleRecord((prev) => ({ ...prev, quantity: 0 }));
                value = value.replace(/\D/g, "");
                setSingleRecord((prev) => ({
                  ...prev,
                  quantity: parseInt(value),
                }));
              }}
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="price"
              label="Cena"
              placeholder={numberFormatter.format(78)}
              isRequired
              value={singleRecord.price.toString()}
              onChange={(e) => {
                let { value } = e.target;
                if (value === "")
                  return setSingleRecord((prev) => ({ ...prev, price: 0 }));
                value = value.replace(/\D/g, "");
                setSingleRecord((prev) => ({
                  ...prev,
                  price: parseFloat(value),
                }));
              }}
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="commission"
              label="Prowizja"
              placeholder={numberFormatter.format(5)}
              isDisabled={!singleRecord.price || !singleRecord.quantity}
              isRequired
              value={singleRecord.commission.toString()}
              onChange={(e) => {
                let { value } = e.target;
                if (value === "")
                  return setSingleRecord((prev) => ({
                    ...prev,
                    commission: 0,
                  }));
                value = value.replace(/\D/g, "");
                setSingleRecord((prev) => ({
                  ...prev,
                  commission: parseFloat(value),
                }));
              }}
            />
            <Input
              classNames={{ base: "col-span-2", inputWrapper: "!bg-light" }}
              name="value"
              label="Wartość"
              readOnly
              isRequired
              value={numberFormatter.format(
                singleRecord.price * singleRecord.quantity
              )}
            />
            {/* <Textarea
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
            /> */}
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
            className="h-9 w-24 text-white"
          >
            {isPending ? (
              <Spinner color="white" size="sm" />
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
        <div></div>
      </div>
    </div>
  );
}
