"use client";

import useClientQuery from "@/hooks/useClientQuery";
import { addGoalPayment } from "@/lib/goals/actions";
import { getBudget } from "@/lib/operations/queries";
import numberFormat from "@/utils/formatters/currency";
import formatAmount from "@/utils/operations/format-amount";
import { createClient } from "@/utils/supabase/client";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRef, useState } from "react";

type Props = {
  goal: Goal;
  amount: number;
  max: number;
};

const date = new Date().toISOString();

export default function PaymentPopover({
  amount: defaultAmount,
  goal,
  max,
}: Props) {
  const [inputValue, setInputValue] = useState(defaultAmount.toString());
  const [triggerValue, setTriggerValue] = useState(defaultAmount);
  const { results } = useClientQuery({ query: getBudget(goal.currency) });

  async function onSubmit() {
    const supabase = createClient();
    const res = await supabase
      .from("goals_payments")
      .upsert({ date, goal_id: goal.id, amount: inputValue })
      .match({ goal_id: goal.id, date });

    console.log(res);
  }

  return (
    <Popover placement="top" onClose={onSubmit}>
      <PopoverTrigger>
        <button className="w-full bg-light border-primary/10 border rounded-md px-4 py-2">
          {numberFormat(goal.currency, triggerValue)}
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
