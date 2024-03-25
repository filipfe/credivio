import { Input } from "@nextui-org/input";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { Key, useMemo } from "react";
import Add from "../cta/add";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

type Props = Pick<TableProps<any>, "title" | "type" | "rows"> &
  Pick<SearchParams, "search"> & {
    handleSearch: (input: string) => void;
    labels?: Label[];
    handleLabelChange?: (selectedKey?: string) => void;
    label?: string;
  };

export default function TopContent({
  title,
  type,
  rows,
  search,
  handleSearch,
  labels,
  handleLabelChange,
  label,
}: Props) {
  const topContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between gap-4 h-10">
        <div className="flex items-center gap-8">
          <h1 className="text-lg whitespace-nowrap">{title}</h1>
          <Input
            isClearable
            size="sm"
            className="max-w-[24rem]"
            classNames={{
              inputWrapper: "!bg-light !h-9",
            }}
            placeholder="Wyszukaj"
            startContent={<SearchIcon size={16} className="mx-1" />}
            defaultValue={search}
            onValueChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {labels && handleLabelChange && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  {label ? label : "Wybierz etykietę"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Label filter"
                selectedKeys={[label] as string[]}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]?.toString();
                  handleLabelChange(selectedKey);
                }}
              >
                {labels.map((label) => (
                  <DropdownItem key={label.name}>
                    {`${label.name} (${label.count})`}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {type && rows.length > 0 && <Add type={type} />}
        </div>
      </div>
    );
  }, [search, rows, label]);
  return topContent;
}
