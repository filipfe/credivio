import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import formatAmount from "@/utils/operation/format-amount";
import { Button, Input, Textarea } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { Fragment } from "react";

type Props = {
  operation: Operation;
  onChange: (key: string, value: any) => void;
  showButton?: boolean;
};

export default function Manual({ operation, onChange, showButton }: Props) {
  return (
    <Fragment>
      <div className="grid grid-cols-2 gap-4">
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="title"
          label="Tytuł"
          placeholder="Wynagrodzenie"
          isRequired
          value={operation.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="amount"
          label="Kwota"
          placeholder="0.00"
          isRequired
          value={operation.amount}
          onBlur={(e) => {
            const value = parseFloat(operation.amount);

            !isNaN(value) &&
              onChange("amount", value == 0 ? "" : value.toString());
          }}
          onChange={(e) => onChange("amount", formatAmount(e.target.value))}
        />
        <UniversalSelect
          name="currency"
          label="Waluta"
          selectedKeys={[operation.currency]}
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
          value={operation.issued_at}
          onChange={(e) => onChange("issued_at", e.target.value)}
        />
        <Textarea
          className="col-span-2"
          classNames={{ inputWrapper: "!bg-light" }}
          name="description"
          label="Opis"
          placeholder="Wynagrodzenie za luty"
          value={operation.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      {showButton && (
        <div className="flex justify-end mt-8">
          <Button color="secondary" type="submit" className="h-9 text-white">
            <PlusIcon className="mt-0.5" size={16} />
            Dodaj
          </Button>
        </div>
      )}
    </Fragment>
  );
}
