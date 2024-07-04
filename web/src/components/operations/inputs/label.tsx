import useClientQuery from "@/hooks/useClientQuery";
import { getLabels } from "@/lib/operations/actions";
import { Autocomplete, AutocompleteItem, Tooltip } from "@nextui-org/react";
import { HelpCircleIcon } from "lucide-react";

type Props = {
  value?: string;
  onChange: (label: string) => void;
  isDisabled?: boolean;
};

export default function LabelInput({ value, onChange, isDisabled }: Props) {
  const { results: labels, isLoading } = useClientQuery({
    deps: [isDisabled],
    query: getLabels(),
    condition: !isDisabled,
  });

  return (
    <div className="relative flex items-center">
      <Autocomplete
        name="label"
        label="Etykieta"
        placeholder="Jedzenie"
        isClearable={false}
        allowsCustomValue
        allowsEmptyCollection={false}
        isLoading={isLoading}
        isDisabled={isDisabled}
        value={value}
        inputProps={{
          classNames: {
            inputWrapper: "!bg-light",
          },
        }}
        maxLength={48}
        showScrollIndicators
        onSelectionChange={(key) => onChange(key?.toString() || "")}
      >
        {labels.map((label) => (
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
        ))}
      </Autocomplete>
      <div className="absolute left-[3.7rem] top-[11px]">
        <Tooltip
          isDisabled={isDisabled}
          size="sm"
          content="Dodaj etykietę, aby pogrupować operacje"
        >
          <HelpCircleIcon size={12} className="text-primary" />
        </Tooltip>
      </div>
    </div>
  );
}
