import { Input } from "@nextui-org/input";
import { SearchIcon } from "lucide-react";
import Add from "../cta/add";

import Filter from "./filter";
import { DebouncedState } from "use-debounce";

type Props = Pick<TableProps<any>, "type"> &
  FilterProps & {
    search?: string;
    handleSearch: DebouncedState<(search?: string) => void>;
  };

export default function TopContent({
  type,
  search,
  state,
  handleSearch,
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
      <div className="items-center gap-3 hidden sm:flex">
        <Filter
          enabled={{ label: type === "expense", currency: true }}
          state={state}
        />
        {type && <Add size="sm" type={type} className="!h-9" />}
      </div>
    </div>
  );
}
