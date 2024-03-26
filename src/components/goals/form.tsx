"use client";

import { Input, Slider, Textarea } from "@nextui-org/react";
import CurrencySelect from "../ui/currency-select";
import formatAmount from "@/utils/operation/format-amount";
import { useState } from "react";

type Props = {
  defaultValue?: Goal;
  hideCSV?: boolean;
};

const defaultRecord: Goal = {
  id: "",
  title: "",
  price: 0,
  saved: 0,
  currency: "PLN",
  description: "",
};

export default function GoalForm({ defaultValue, hideCSV }: Props) {
  const [singleRecord, setSingleRecord] = useState<Goal>(
    defaultValue || defaultRecord
  );

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleRecord(defaultRecord);
  };

  return (
    <form>
      <div className="flex flex-col xl:grid grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col">
          <h2 className="text-lg">Dane</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
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
              placeholder="0.00"
              isRequired
              value={singleRecord.price.toString()}
              onBlur={(e) => {
                const value = singleRecord.price;

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
                  currency: curr.toString(),
                }))
              }
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="deadline"
              label="Termin ostateczny"
              placeholder="24.01.2024"
              type="date"
              value={singleRecord.deadline}
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
        </div>
        <div className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col">
          <h2 className="text-lg">Grupuj</h2>
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            name="label"
            label="Etykieta"
            placeholder="Rozrywka"
            value={singleRecord.label}
            onChange={(e) =>
              setSingleRecord((prev) => ({
                ...prev,
                label: e.target.value,
              }))
            }
          />
          <Slider
            className="mt-2"
            color="primary"
            step={10}
            label="Priorytet"
            name="priority"
            showSteps
            maxValue={100}
            minValue={0}
            defaultValue={50}
            getValue={(value) => {
              if (value === 50) return "Neutralne";
              if ((value as number) > 80) return "Pilne";
              if ((value as number) < 20) return "";
              return "";
            }}
          />
        </div>
        {/* <OperationTable
        title="Podgląd"
        operations={records}
        count={records.length}
        setOperations={setRecords}
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
                    value={label.title}
                    textValue={label.title}
                    classNames={{
                      base: "!bg-white hover:!bg-light",
                    }}
                    key={label.title}
                  >
                    {label.title}{" "}
                    <span className="text-font/80">{`(${label.count[0].count})`}</span>
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
      </OperationTable> */}
      </div>
    </form>
  );
}
