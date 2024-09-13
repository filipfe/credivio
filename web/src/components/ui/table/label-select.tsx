import { Select, SelectItem } from "@nextui-org/react";
import { useLabels } from "@/lib/operations/queries";

export default function LabelSelect({ value, onChange }: State) {
  const { data: labels, isLoading } = useLabels();

  return (
    <Select
      name="label"
      placeholder="Jedzenie"
      aria-label="Label filter"
      label="Etykieta"
      size="sm"
      isLoading={isLoading}
      isDisabled={isLoading}
      selectedKeys={[value || "all"]}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0]?.toString();
        onChange(selectedKey === "all" ? "" : selectedKey);
      }}
      classNames={{
        trigger: "bg-light",
      }}
    >
      {
        (
          <SelectItem
            value="Wszystkie"
            className={`${
              value === "" ? "!bg-light" : "!bg-white hover:!bg-light"
            }`}
            key="all"
          >
            Wszystkie
          </SelectItem>
        ) as any
      }
      {labels
        ? labels.map(({ name, count }) => (
            <SelectItem
              value={name}
              description={`${count} wydatków`}
              classNames={{
                base: `${
                  value === name ? "!bg-light" : "!bg-white hover:!bg-light"
                }`,
              }}
              key={name}
            >
              {name}
            </SelectItem>
          ))
        : []}
    </Select>
  );
}
