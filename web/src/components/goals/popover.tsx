"use client";

import formatAmount from "@/utils/operations/format-amount";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import Toast from "../ui/toast";
import { addGoalPayment } from "@/lib/goals/actions";
import NumberFormat from "@/utils/formatters/currency";
// import { addGoalPayment } from "@/lib/goals/queries";

type Props = {
  goal: Goal;
  amount: number;
  max: number;
};

export default function PaymentPopover({
  goal,
  amount: defaultAmount,
  max,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(defaultAmount.toString());

  function onClose() {
    if (!inputValue || inputValue === defaultAmount.toString()) return;
    const amount = parseFloat(inputValue);
    if (amount > max) {
      toast.custom((t) => (
        <Toast {...t} type="error" message="Kwota przekracza cenę celu!" />
      ));
      setInputValue(defaultAmount.toString());
      return;
    }
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  }

  const onSubmit = (formData: FormData) =>
    startTransition(async () => {
      const { error } = await addGoalPayment(formData);
      if (error) {
        toast.custom((t) => (
          <Toast
            {...t}
            type="error"
            message="Wystąpił błąd przy dodawaniu płatności!"
          />
        ));
      } else {
        toast.custom((t) => (
          <Toast
            {...t}
            type="success"
            message={`Pomyślnie dodano płatność do celu ${goal.title}!`}
          />
        ));
      }
    });

  return (
    <Popover placement="top" onClose={onClose}>
      <PopoverTrigger>
        <button className="w-full bg-light border rounded-md px-4 py-2">
          <NumberFormat currency={goal.currency} amount={defaultAmount} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="py-2">
        <form ref={formRef} action={onSubmit}>
          <AmountInput
            max={max}
            value={inputValue}
            onChange={(value) => setInputValue(value)}
          />
          <input type="hidden" name="goal_id" value={goal.id} />
          <input type="hidden" name="amount" value={inputValue} />
        </form>
      </PopoverContent>
    </Popover>
  );
}

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  max: number;
};

const AmountInput = ({ value, onChange, max }: InputProps) => {
  return (
    <div className="flex items-center relative">
      <Input
        autoFocus
        label="Kwota"
        name="amount"
        isInvalid={parseFloat(value) > max}
        classNames={{
          inputWrapper: "!outline-none",
        }}
        value={value}
        onValueChange={(value) => onChange(formatAmount(value))}
      />
      <Button
        size="sm"
        radius="md"
        isIconOnly
        disableRipple
        className="border bg-white absolute right-2 min-w-12 z-10"
        onClick={() => onChange(max.toString())}
      >
        100%
      </Button>
    </div>
  );
};
