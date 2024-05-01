"use client";

import { CURRENCIES } from "@/const";
import { Select, SelectItem, SelectProps } from "@nextui-org/react";

export default function CurrencySelect(props: Omit<SelectProps, "children">) {
  return (
    <Select
      name="currency"
      label="Waluta"
      placeholder="PLN"
      disallowEmptySelection
      {...props}
    >
      {CURRENCIES.map((curr) => (
        <SelectItem
          value={curr}
          classNames={{
            base: "!bg-white hover:!bg-light",
          }}
          key={curr}
        >
          {curr}
        </SelectItem>
      ))}
    </Select>
  );
}
