import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { Input, Textarea } from "@nextui-org/react";
import { FormHTMLAttributes, useState } from "react";
import LabelInput from "./label";
import AmountInput from "./amount";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  type: OperationType;
  initialValue?: Operation;
  defaultCurrency?: string;
  withLabel?: boolean;
}

export default function Manual({
  type,
  initialValue,
  defaultCurrency,
  withLabel,
  ...props
}: Props) {
  const currency = initialValue?.currency || defaultCurrency;

  return (
    <form {...props}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="title"
          label="Tytuł"
          placeholder="Wynagrodzenie"
          isRequired
          required
          defaultValue={initialValue?.title}
        />
        <AmountInput defaultValue={initialValue?.amount} />
        <UniversalSelect
          name="currency"
          label="Waluta"
          elements={CURRENCIES}
          required
          isRequired
          defaultSelectedKeys={currency ? [currency] : []}
        />
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="issued_at"
          label="Data uiszczenia"
          placeholder="24.01.2024"
          type="date"
          required
          isRequired
          defaultValue={
            initialValue?.issued_at || new Date().toJSON().substring(0, 10)
          }
        />
        <Textarea
          className="col-span-2"
          classNames={{ inputWrapper: "!bg-light" }}
          name="description"
          label="Opis"
          placeholder="Wynagrodzenie za luty"
          defaultValue={initialValue?.description}
        />
        {type === "expense" && withLabel && (
          <div className="w-full col-span-2">
            <LabelInput defaultValue={initialValue?.label} />
          </div>
        )}
      </div>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={initialValue?.id} />
    </form>
  );
}
