import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { Input, Textarea } from "@nextui-org/react";
import { FormHTMLAttributes } from "react";
import LabelInput from "./label";
import AmountInput from "./amount";
import { v4 } from "uuid";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  type: OperationType;
  initialValue?: Operation;
  // onAdd?: (record: Operation) => void;
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
          defaultValue={initialValue?.title}
        />
        <AmountInput defaultValue={initialValue?.amount} />
        <UniversalSelect
          name="currency"
          label="Waluta"
          elements={CURRENCIES}
          defaultSelectedKeys={currency ? [currency] : []}
        />
        <Input
          classNames={{ inputWrapper: "!bg-light" }}
          name="issued_at"
          label="Data uiszczenia"
          placeholder="24.01.2024"
          type="date"
          isRequired
          defaultValue={initialValue?.issued_at}
        />
        <Textarea
          className="col-span-2"
          classNames={{ inputWrapper: "!bg-light" }}
          name="description"
          label="Opis"
          placeholder="Wynagrodzenie za luty"
          defaultValue={initialValue?.description}
        />
        {withLabel && (
          <div className="w-full col-span-2">
            <LabelInput defaultValue={initialValue?.label} />
          </div>
        )}
      </div>
      {/* <input type="hidden" name="operation" value={JSON.stringify(record)} /> */}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={initialValue?.id || v4()} />
    </form>
  );
}

// const Form = ({
//   children,
//   onAdd,
//   record,
// }: { children: React.ReactNode; record: Operation } & Pick<Props, "onAdd">) => {
//   const onSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     onAdd && onAdd(record);
//   };

//   const isDisabled = ["title", "issued_at", "amount", "currency"].some(
//     (key) => !record[key as keyof Operation]
//   );

//   return onAdd ? (
//     <form onSubmit={onSubmit}>
//       {children}
//       <div className="flex justify-end mt-8">
//         <Button
//           color="secondary"
//           type="submit"
//           className="h-9 text-white"
//           isDisabled={isDisabled}
//           disabled={isDisabled}
//         >
//           <PlusIcon className="mt-0.5" size={16} />
//           Dodaj
//         </Button>
//       </div>
//     </form>
//   ) : (
//     children
//   );
// };
