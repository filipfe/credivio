"use client";

import { Select, SelectItem, SelectProps } from "@nextui-org/react";

type Props = Omit<SelectProps, "children"> & {
  elements: string[] | Option<string>[];
};

export default function UniversalSelect(props: Props) {
  return (
    <Select
      classNames={{
        trigger: "!bg-light",
      }}
      disallowEmptySelection
      {...props}
    >
      {
        (
          <SelectItem value="Wszystkie" key="Wszystkie">
            Wszystkie
          </SelectItem>
        ) as any
      }
      {props.elements.map((element) => (
        <SelectItem
          value={typeof element === "string" ? element : element.value}
          classNames={{
            base: "!bg-white hover:!bg-light",
          }}
          key={typeof element === "string" ? element : element.value}
        >
          {typeof element === "string" ? element : element.name}
        </SelectItem>
      ))}
    </Select>
  );
}
