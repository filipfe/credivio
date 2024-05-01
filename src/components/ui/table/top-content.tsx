import { Input } from "@nextui-org/input";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import Add from "../cta/add";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import CurrencySelect from "../currency-select";

type Props = Pick<TableProps<any>, "type" | "rows"> &
  Pick<SearchParams, "search"> & {
    handleSearch: (input: string) => void;
    labels?: Label[];
    handleLabelChange?: (selectedKey?: string) => void;
    label?: string;
    handleCurrencyChange: (selectedKey: string) => void;
    defaultCurrency?: string;
  };

export default function TopContent({
  type,
  rows,
  search,
  handleSearch,
  handleCurrencyChange,
  defaultCurrency,
  ...props
}: Props) {
  return (
    <div className="flex-1 flex items-center sm:justify-between gap-4 sm:gap-8">
      <Input
        isClearable
        size="sm"
        className="max-w-[24rem]"
        classNames={{
          inputWrapper: "!h-9",
        }}
        placeholder="Wyszukaj"
        startContent={<SearchIcon size={16} className="mx-1" />}
        defaultValue={search}
        onValueChange={handleSearch}
      />
      <div className="items-center gap-4 hidden sm:flex">
        {defaultCurrency && (
          <CurrencySelect
            defaultSelectedKeys={[defaultCurrency]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0].toString();
              handleCurrencyChange(selectedKey);
            }}
          />
        )}
        <LabelSelect {...props} />
        {type && rows.length > 0 && (
          <Add size="sm" type={type} className="!h-9" />
        )}
      </div>
    </div>
  );
}

export const LabelSelect = ({
  label,
  labels,
  handleLabelChange,
}: Pick<Props, "labels" | "handleLabelChange" | "label">) => {
  if (!labels || !handleLabelChange) return;
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size="sm"
          endContent={<ChevronDownIcon size={16} />}
          disableAnimation
          variant="flat"
          className="bg-light !h-9"
        >
          {label ? label : "Wybierz etykietę"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        emptyContent="Brak etykiet!"
        aria-label="Label filter"
        selectedKeys={[label] as string[]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0]?.toString();
          handleLabelChange(selectedKey === "all" ? "" : selectedKey);
        }}
      >
        {
          (label && (
            <DropdownItem className="!bg-white hover:!bg-light" key="all">
              Wszystkie
            </DropdownItem>
          )) as any
        }
        {labels.map(({ name, count }) => (
          <DropdownItem
            className={`${
              label === name ? "!bg-light" : "!bg-white hover:!bg-light"
            }`}
            title={name}
            description={`${count} wydatków`}
            key={name}
          />
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
