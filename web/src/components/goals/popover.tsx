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
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import Toast from "../ui/toast";
import useSWR from "swr";
import { addGoalPayment } from "@/lib/goals/actions";
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
  // const { data, mutate } = useSWR("goals_payments");
  const { results } = useClientQuery({ query: getBudget(goal.currency) });

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
    // const { error } = await addGoalPayment(goal.id, inputValue);
    // if (error) {
    //   console.error("Couldn't add goal payment: ", error);
    //   toast.custom((t) => (
    //     <Toast
    //       {...t}
    //       type="error"
    //       message="Wystąpił błąd przy dodawaniu płatności!"
    //     />
    //   ));
    // } else {
    //   toast.custom((t) => (
    //     <Toast
    //       {...t}
    //       type="success"
    //       message={`Pomyślnie dodano płatność do celu ${goal.title}!`}
    //     />
    //   ));
    //   const now = new Date();
    // const newPayments = data
    //   ? data.map((payment: GoalPayment) =>
    //       payment.goal_id === goal.id &&
    //       payment.date ===
    //         `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    //         ? { ...payment, amount }
    //         : payment
    //     )
    //   : [];
    // mutate(newPayments);
    // }
  }

  const onSubmit = (formData: FormData) =>
    startTransition(async () => {
      const res = await addGoalPayment(formData);
      if (res?.error) {
        toast.custom(
          (t) => (
            <Toast
              {...t}
              type="error"
              message="Wystąpił błąd przy dodawaniu płatności!"
            />
          ),
          { duration: 3000 }
        );
      } else {
        toast.custom(
          (t) => (
            <Toast
              {...t}
              type="success"
              message={`Pomyślnie dodano płatność do celu ${goal.title}!`}
            />
          ),
          { duration: 3000 }
        );
      }
    });

  return (
    <Popover placement="top" onClose={onClose}>
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
        className="border border-primary/10 bg-white absolute right-2 min-w-12 z-10"
        onClick={() => onChange(max.toString())}
      >
        100%
      </Button>
    </div>
  );
};
