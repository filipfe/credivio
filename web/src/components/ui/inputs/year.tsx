import { Select, SelectItem } from "@nextui-org/react";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const year = new Date().getFullYear();

export default function YearInput({ value, onChange }: Props) {
  return (
    <Select
      name="year"
      aria-label="Year filter"
      size="sm"
      selectedKeys={[value.toString()]}
      onChange={(e) => onChange(parseInt(e.target.value))}
      classNames={{
        trigger: "!bg-light",
      }}
      disallowEmptySelection
      className="w-36"
    >
      {Array.from(Array(year - 2024 + 1)).map((_, k) => (
        <SelectItem
          classNames={{
            base: `${
              value === k + 2024 ? "!bg-light" : "!bg-white hover:!bg-light"
            }`,
          }}
          key={(k + 2024).toString()}
        >
          {(k + 2024).toString()}
        </SelectItem>
      ))}
    </Select>
  );
}
