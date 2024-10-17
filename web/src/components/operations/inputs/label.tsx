"use client";

import { Dict } from "@/const/dict";
import { useLabels } from "@/lib/operations/queries";
import { Autocomplete, AutocompleteItem, cn, Tooltip } from "@nextui-org/react";
import { HelpCircleIcon } from "lucide-react";

type Props = {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"]["modal"]["edit"]["form"]["label"];
  className?: string;
  defaultValue?: string | null;
};

export default function LabelInput({ dict, defaultValue, className }: Props) {
  const { data: labels, isLoading } = useLabels();

  return (
    <div className="relative flex items-center">
      <Autocomplete
        name="label"
        label={dict.label}
        placeholder={dict.placeholder}
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
                description={`${label.count} ${dict.description}`}
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
        <Tooltip size="sm" content={dict.tooltip}>
          <HelpCircleIcon size={12} className="text-primary" />
        </Tooltip>
      </div>
    </div>
  );
}
