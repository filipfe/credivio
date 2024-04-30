"use client";

import { LANGUAGES } from "@/const";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";

export default function LanguageSelect(
  props: Omit<AutocompleteProps, "children">
) {
  return (
    <Autocomplete
      name="language"
      label="Wybierz język"
      labelPlacement="outside-left"
      placeholder="Polski"
      isClearable={false}
      inputProps={{
        classNames: {
          inputWrapper: "!bg-light",
        },
      }}
      {...props}
    >
      {LANGUAGES.map((curr) => (
        <AutocompleteItem
          value={curr}
          classNames={{
            base: "!bg-white hover:!bg-light",
          }}
          key={curr}
        >
          {curr}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
