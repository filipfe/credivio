"use client";

import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import formatAmount from "@/utils/operation/format-amount";
import { Button, Input, Textarea } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";

const defaultRecord: Omit<Operation, "id"> = {
  title: "",
  issued_at: new Date().toISOString().substring(0, 10),
  amount: "",
  description: "",
  currency: "",
  doc_path: null,
};

type Props = {
  value?: Operation;
  onAdd?: (record: Operation) => void;
  defaultCurrency?: string;
};

export default function Manual({ value, onAdd, defaultCurrency }: Props) {
  const [record, setRecord] = useState<Operation>(
    value || {
      ...defaultRecord,
      currency: defaultCurrency || "USD",
      id: v4(),
    }
  );

  const onChange = (key: keyof Operation, value: any) =>
    setRecord((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    value && setRecord(value);
  }, [value]);

  return (
    <Form onAdd={onAdd} record={record}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="title"
          label="Tytuł"
          placeholder="Wynagrodzenie"
          isRequired
          value={record.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="amount"
          label="Kwota"
          placeholder="0.00"
          isRequired
          value={record.amount}
          onBlur={(e) => {
            const float = parseFloat(record.amount);

            !isNaN(float) &&
              onChange("amount", float == 0 ? "" : float.toString());
          }}
          onChange={(e) => onChange("amount", formatAmount(e.target.value))}
        />
        <UniversalSelect
          name="currency"
          label="Waluta"
          selectedKeys={[record.currency]}
          elements={CURRENCIES}
          onChange={(e) => {
            onChange("currency", e.target.value);
          }}
        />
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="issued_at"
          label="Data uiszczenia"
          placeholder="24.01.2024"
          type="date"
          isRequired
          value={record.issued_at}
          onChange={(e) => onChange("issued_at", e.target.value)}
        />
        <Textarea
          className="col-span-2"
          classNames={{ inputWrapper: "!bg-light" }}
          name="description"
          label="Opis"
          placeholder="Wynagrodzenie za luty"
          value={record.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
    </Form>
  );
}

const Form = ({
  children,
  onAdd,
  record,
}: { children: React.ReactNode; record: Operation } & Pick<Props, "onAdd">) => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd && onAdd(record);
  };

  const isDisabled = ["title", "issued_at", "amount", "currency"].some(
    (key) => !record[key as keyof Operation]
  );

  return onAdd ? (
    <form onSubmit={onSubmit}>
      {children}
      <div className="flex justify-end mt-8">
        <Button
          color="secondary"
          type="submit"
          className="h-9 text-white"
          isDisabled={isDisabled}
          disabled={isDisabled}
        >
          <PlusIcon className="mt-0.5" size={16} />
          Dodaj
        </Button>
      </div>
    </form>
  ) : (
    children
  );
};
