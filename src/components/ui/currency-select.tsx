import { CURRENCIES } from "@/const";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";

export default function CurrencySelect(
  props: Omit<AutocompleteProps, "children">
) {
  return (
    <Autocomplete
      name="currency"
      label="Waluta"
      placeholder="PLN"
      isClearable={false}
      isRequired
      inputProps={{
        classNames: {
          inputWrapper: "!bg-light",
        },
      }}
      {...props}
    >
      {CURRENCIES.map((curr) => (
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
