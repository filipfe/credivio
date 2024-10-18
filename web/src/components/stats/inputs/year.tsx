import { StatsFilterContext } from "@/app/(private)/(sidebar)/stats/providers";
import { now } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/react";
import { useContext } from "react";

type Props = {
  value?: number;
  onChange: (value: number) => void;
};

export default function YearInput({ value, onChange }: Props) {
  const {
    settings: { timezone },
  } = useContext(StatsFilterContext);
  const { year } = now(timezone);
  return (
    <Select
      name="year"
      aria-label="Year filter"
      placeholder="Rok"
      size="sm"
      radius="md"
      selectedKeys={value ? [value.toString()] : []}
      onChange={(e) => onChange(parseInt(e.target.value))}
      classNames={{
        trigger: "!bg-light shadow-none border min-w-20 sm:min-w-24",
      }}
      disallowEmptySelection
    >
      {Array.from(Array(year - 2023 + 1)).map((_, k) => (
        <SelectItem
          classNames={{
            base: `${
              value === k + 2023 ? "!bg-light" : "!bg-white hover:!bg-light"
            }`,
          }}
          key={(k + 2023).toString()}
        >
          {(k + 2023).toString()}
        </SelectItem>
      ))}
    </Select>
  );
}
