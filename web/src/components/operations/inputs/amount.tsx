import formatAmount from "@/utils/operations/format-amount";
import { Input } from "@nextui-org/react";
import { useState } from "react";

type Props = {
  defaultValue?: string;
};

export default function AmountInput({ defaultValue }: Props) {
  const [amount, setAmount] = useState(defaultValue || "");

  return (
    <Input
      classNames={{ inputWrapper: "!bg-light" }}
      name="amount"
      label="Kwota"
      placeholder="0.00"
      required
      isRequired
      value={amount}
      onBlur={(e) => {
        const float = parseFloat(amount);

        !isNaN(float) && setAmount(float == 0 ? "" : float.toString());
      }}
      onChange={(e) => setAmount(formatAmount(e.target.value))}
    />
  );
}
