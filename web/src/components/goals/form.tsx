"use client";

import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import formatAmount from "@/utils/operations/format-amount";
import { useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import Block from "../ui/block";
import Toast from "../ui/toast";
import { addGoal } from "@/lib/goals/actions";

interface NewGoal extends Omit<Goal, "id" | "saved" | "price" | "payments"> {
  price: string;
}

const defaultRecord: NewGoal = {
  title: "",
  price: "",
  currency: "",
  description: "",
};

export default function GoalForm({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [singleRecord, setSingleRecord] = useState<NewGoal>({
    ...defaultRecord,
    currency: defaultCurrency,
  });

  return (
    <Block title="Nowy cel" className="w-full max-w-4xl">
      <form
        action={(formData) =>
          startTransition(async () => {
            const { error } = await addGoal(formData);
            if (error) {
              toast.custom((t) => (
                <Toast
                  {...t}
                  type="error"
                  message="Wystąpił błąd przy dodawaniu celu"
                />
              ));
            }
          })
        }
        className="grid grid-cols-2 gap-4"
      >
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="title"
          label="Tytuł"
          placeholder="Mieszkanie"
          isRequired
          value={singleRecord.title}
          onChange={(e) =>
            setSingleRecord((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="amount"
          label="Kwota"
          placeholder="0.00"
          isRequired
          value={singleRecord.price}
          onBlur={(_) => {
            const value = parseFloat(singleRecord.price);
            !isNaN(value) &&
              setSingleRecord((prev) => ({
                ...prev,
                price: value === 0 ? "" : value.toString(),
              }));
          }}
          onChange={(e) => {
            setSingleRecord((prev) => ({
              ...prev,
              price: formatAmount(e.target.value),
            }));
          }}
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
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="deadline"
          label="Termin ostateczny"
          placeholder="24.01.2024"
          type="date"
          value={singleRecord.deadline}
          onChange={(e) =>
            setSingleRecord((prev) => ({
              ...prev,
              deadline: e.target.value,
            }))
          }
        />
        <Textarea
          className="col-span-2"
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="description"
          label="Opis"
          placeholder="Miejsce zamieszkania"
          value={singleRecord.description}
          onChange={(e) =>
            setSingleRecord((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
        <div className="col-span-2 flex justify-end mt-4">
          <Button color="primary" type="submit" isDisabled={isPending}>
            {isPending ? (
              <Spinner color="white" size="sm" />
            ) : (
              <CheckIcon size={16} />
            )}
            Zapisz
          </Button>
        </div>
        <input type="hidden" value={JSON.stringify(singleRecord)} name="data" />
        <input type="hidden" value="goal" name="type" />
      </form>
    </Block>
  );
}
{
  /* <div className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col">
          <h2 className="text-lg">Grupuj</h2>
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
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
            color={
              singleRecord.priority === 2
                ? "warning"
                : singleRecord.priority === 3
                ? "danger"
                : "primary"
            }
            step={1}
            label="Priorytet"
            name="priority"
            showSteps
            maxValue={3}
            minValue={1}
            value={singleRecord.priority}
            onChange={(value) =>
              setSingleRecord((prev) => ({
                ...prev,
                priority: value as number,
              }))
            }
            getValue={(value) => {
              if (value[0] === 3) return "Pilne";
              if (value[0] === 1) return "";
              return "Neutralne";
            }}
          />
        </div>
      <OperationTable
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
      </OperationTable> */
}
