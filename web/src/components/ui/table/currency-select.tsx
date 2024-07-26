"use client";

import { CURRENCIES } from "@/const";
import { Select, SelectItem } from "@nextui-org/react";

interface Props extends State {
  disallowAll?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CurrencySelect({
  onChange,
  value,
  size = "sm",
  disallowAll,
}: Props) {
  return (
    <Select
      name="currency"
      placeholder="PLN"
      label="Waluta"
      size={size}
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0]?.toString();
        onChange(selectedKey === "all" ? "" : selectedKey);
      }}
      classNames={{
        trigger: "!bg-light",
      }}
      disallowEmptySelection
      className="w-full"
    >
      {!disallowAll &&
        ((
          <SelectItem
            value=""
            className={`${
              value === "" ? "!bg-light" : "!bg-white hover:!bg-light"
            }`}
            key=""
          >
            Wszystkie
          </SelectItem>
        ) as any)}
      {CURRENCIES.map((curr) => (
        <SelectItem
          value={curr}
          className={`${
            curr === value ? "!bg-light" : "!bg-white hover:!bg-light"
          }`}
          key={curr}
        >
          {curr}
        </SelectItem>
      ))}
    </Select>
  );
}
