import { Input } from "@nextui-org/input";
import { SearchIcon } from "lucide-react";
import { useMemo } from "react";
import Add from "../cta/add";

type Props = Pick<TableProps<any>, "title" | "type" | "rows"> &
  Pick<SearchParams, "search"> & {
    handleSearch: (input: string) => void;
  };

export default function TopContent({
  title,
  type,
  rows,
  search,
  handleSearch,
}: Props) {
  const topContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between gap-4 h-10">
        <div className="flex items-center gap-8">
          <h1 className="text-lg">{title}</h1>
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
          {type && rows.length > 0 && <Add type={type} />}
        </div>
      </div>
    );
  }, [search, rows]);
  return topContent;
}
