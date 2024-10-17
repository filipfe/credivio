"use client";

import { CURRENCIES } from "@/const";
import { Dict } from "@/const/dict";
import { Select, SelectItem, SelectProps } from "@nextui-org/react";

export default function CurrencySelect({
  dict,
  onChange,
  value,
  ...props
}: Pick<SelectProps, "labelPlacement"> &
  State & {
    dict: Dict["private"]["operations"]["operation-table"]["top-content"]["filter"]["currency"];
  }) {
  return (
    <Select
      name="currency"
      label={dict.label}
      size="sm"
      radius="md"
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0]?.toString();
        onChange(selectedKey === "all" ? "" : selectedKey);
      }}
      classNames={{
        trigger: "bg-light shadow-none ",
      }}
      disallowEmptySelection
      className="w-full"
      {...props}
    >
      {
        (
          <SelectItem
            value=""
            className={`${
              value === "" ? "!bg-light" : "!bg-white hover:!bg-light"
            }`}
            key=""
          >
            {dict.default}
          </SelectItem>
        ) as any
      }
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
