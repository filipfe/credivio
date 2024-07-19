import { Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import Add from "../cta/add";

import Filter from "./filter";
import { DebouncedState } from "use-debounce";
import Delete from "../cta/delete";
import PeriodSelect from "./period-select";

type Props = FilterProps & {
  search?: string;
  handleSearch: DebouncedState<(search?: string) => void>;
  type: OperationType;
  deletionCallback?: () => void;
  selected: string[];
  addHref?: string;
  showPeriodFilter?: boolean;
  viewOnly?: boolean;
};

export default function TopContent({
  type,
  search,
  state,
  selected,
  addHref,
  deletionCallback,
  handleSearch,
  showPeriodFilter,
  viewOnly,
}: Props) {
  return (
    <div className="flex-1 flex items-center justify-between gap-4 sm:gap-8">
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
      <div className="items-center gap-3 flex">
        {selected.length > 0 && (
          <Delete
            callback={deletionCallback}
            items={selected}
            type={type as OperationType}
            viewOnly={viewOnly}
          />
        )}
        {showPeriodFilter && <PeriodSelect />}
        <Filter
          enabled={{
            label: type === "expense",
            currency: true,
            transaction: type === "stock",
          }}
          state={state}
        />
        {addHref && (
          <div className="hidden sm:block">
            <Add size="sm" href={addHref} className="!h-10" />
          </div>
        )}
      </div>
    </div>
  );
}
