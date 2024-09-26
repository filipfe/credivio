import { Select, SelectItem } from "@nextui-org/react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  disabledKeys: string[];
};

export default function MonthInput({ value, onChange, disabledKeys }: Props) {
  const formatter = new Intl.DateTimeFormat("pl-PL", {
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
        trigger: "!bg-light shadow-none border",
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
