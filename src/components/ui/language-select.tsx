"use client";

import { LANGUAGES } from "@/const";
import { Select, SelectItem, SelectProps } from "@nextui-org/react";

export default function LanguageSelect(props: Omit<SelectProps, "children">) {
  return (
    <Select
      name="language"
      label="Wybierz język"
      labelPlacement="outside-left"
      placeholder="Polski"
      disallowEmptySelection
      {...props}
    >
      {LANGUAGES.map((curr) => (
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
