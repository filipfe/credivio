"use client";

import useClientQuery from "@/hooks/useClientQuery";
import { getBudget } from "@/lib/operations/queries";
import numberFormat from "@/utils/formatters/currency";
import formatAmount from "@/utils/operations/format-amount";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Toast from "../ui/toast";
import useSWR from "swr";
import { addGoalPayment } from "@/lib/goals/queries";

type Props = {
  goal: Goal;
  amount: number;
  max: number;
};

export default function PaymentPopover({
  amount: defaultAmount,
  goal,
  max,
}: Props) {
  const [inputValue, setInputValue] = useState(defaultAmount.toString());
  const { data, mutate } = useSWR("goals_payments");
  const { results } = useClientQuery({ query: getBudget(goal.currency) });

  async function onSubmit() {
    if (inputValue === defaultAmount.toString()) return;
    const amount = parseFloat(inputValue);
    if (amount > max) {
      toast.custom((t) => (
        <Toast {...t} type="error" message="Kwota przekracza cenę celu!" />
      ));
      setInputValue(defaultAmount.toString());
      return;
    }
    const { error } = await addGoalPayment(goal.id, inputValue);
    if (error) {
      console.error("Couldn't add goal payment: ", error);
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
    const newPayments = data
      ? data.map((payment: GoalPayment) =>
          payment.goal_id === goal.id &&
          payment.date === new Date().toISOString().substring(0, 10)
            ? { ...payment, amount }
            : payment
        )
      : [];
    mutate(newPayments);
  }

  return (
    <Popover placement="top" onClose={onSubmit}>
      <PopoverTrigger>
        <button className="w-full bg-light border-primary/10 border rounded-md px-4 py-2">
          {numberFormat(goal.currency, defaultAmount)}
        </button>
      </PopoverTrigger>
      <PopoverContent className="py-2">
        <p className="mb-2">
          Dostępny budżet:{" "}
          {results.length > 0 ? (
            <span className="font-medium">
              {new Intl.NumberFormat("pl-PL", {
                currency: goal.currency,
                style: "currency",
              }).format(results[0].total_amount)}
            </span>
          ) : (
            <l-hatch size={12} />
          )}
        </p>
        <AmountInput
          max={max}
          value={inputValue}
          onChange={(value) => setInputValue(value)}
        />
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
        className="border border-primary/10 bg-white absolute right-2 min-w-12 z-10"
        onClick={() => onChange(max.toString())}
      >
        100%
      </Button>
    </div>
  );
};
