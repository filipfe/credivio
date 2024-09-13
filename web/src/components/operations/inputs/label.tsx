"use client";

import { useLabels } from "@/lib/operations/queries";
import { Autocomplete, AutocompleteItem, cn, Tooltip } from "@nextui-org/react";
import { HelpCircleIcon } from "lucide-react";

type Props = {
  className?: string;
  defaultValue?: string | null;
};

export default function LabelInput({ defaultValue, className }: Props) {
  const { data: labels, isLoading } = useLabels();

  return (
    <div className="relative flex items-center">
      <Autocomplete
        name="label"
        label="Etykieta"
        placeholder="Jedzenie"
        isClearable={false}
        multiple
        allowsCustomValue
        allowsEmptyCollection={false}
        isLoading={isLoading}
        defaultSelectedKey={defaultValue ? defaultValue : undefined}
        inputProps={{
          classNames: {
            inputWrapper: cn("bg-light border shadow-none", className),
          },
        }}
        maxLength={48}
        showScrollIndicators
      >
        {labels
          ? labels.map((label) => (
              <AutocompleteItem
                value={label.name}
                textValue={label.name}
                description={`${label.count} wydatków`}
                classNames={{
                  base: "!bg-white hover:!bg-light",
                }}
                key={label.name}
              >
                {label.name}
              </AutocompleteItem>
            ))
          : []}
      </Autocomplete>
      <div className="absolute left-[3.7rem] top-[11px]">
        <Tooltip size="sm" content="Dodaj etykietę, aby pogrupować operacje">
          <HelpCircleIcon size={12} className="text-primary" />
        </Tooltip>
      </div>
    </div>
  );
}
