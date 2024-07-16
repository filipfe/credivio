"use client";

import { TRANSACTION_TYPES } from "@/const";
import { Select, SelectItem } from "@nextui-org/react";

export default function TransactionSelect({ onChange, value }: State) {
  return (
    <Select
      name="transaction"
      label="Typ transakcji"
      size="sm"
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0]?.toString();
        onChange(selectedKey === "all" ? "" : selectedKey);
      }}
      classNames={{
        trigger: "!bg-light",
      }}
      disallowEmptySelection
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
            Wszystkie
          </SelectItem>
        ) as any
      }
      {TRANSACTION_TYPES.map((type) => (
        <SelectItem
          value={type.value}
          className={`${
            type.value === value ? "!bg-light" : "!bg-white hover:!bg-light"
          }`}
          key={type.value}
        >
          {type.name}
        </SelectItem>
      ))}
    </Select>
  );
}
