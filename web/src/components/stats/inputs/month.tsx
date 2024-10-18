import { StatsFilterContext } from "@/app/(private)/(sidebar)/stats/providers";
import { Select, SelectItem } from "@nextui-org/react";
import { useContext } from "react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  disabledKeys: string[];
};

export default function MonthInput({ value, onChange, disabledKeys }: Props) {
  const { settings } = useContext(StatsFilterContext);
  const formatter = new Intl.DateTimeFormat(settings.language, {
    month: "long",
  });

  return (
    <Select
      name="month"
      placeholder="Miesiąc"
      aria-label="Month filter"
      size="sm"
      radius="md"
      selectedKeys={[value.toString()]}
      onChange={(e) => onChange(parseInt(e.target.value))}
      classNames={{
        trigger: "!bg-light shadow-none border min-w-32 sm:min-w-40",
      }}
      disallowEmptySelection
      disabledKeys={disabledKeys}
    >
      {Array.from(Array(12)).map((_, k) => {
        const date = new Date();
        date.setMonth(k);
        const month = formatter.format(date);
        return (
          <SelectItem
            classNames={{
              base: `${
                value === k ? "!bg-light" : "!bg-white hover:!bg-light"
              }`,
            }}
            key={k.toString()}
          >
            {month.charAt(0).toUpperCase() + month.substring(1)}
          </SelectItem>
        );
      })}
    </Select>
  );
}
