import { getLabels } from "@/lib/operations/actions";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

export default function LabelSelect({ value, onChange }: State) {
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    (async () => {
      const { results } = await getLabels();
      setLabels(results);
    })();
  }, []);

  return (
    <Select
      name="label"
      placeholder="Jedzenie"
      aria-label="Label filter"
      label="Etykieta"
      size="sm"
      selectedKeys={[value || "Wszystkie"]}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0]?.toString();
        onChange(selectedKey === "all" ? "" : selectedKey);
      }}
      classNames={{
        trigger: "!bg-light",
      }}
    >
      {
        (
          <SelectItem
            value="Wszystkie"
            className={`${
              value === "" ? "!bg-light" : "!bg-white hover:!bg-light"
            }`}
            key="Wszystkie"
          >
            Wszystkie
          </SelectItem>
        ) as any
      }
      {labels.map(({ name, count }) => (
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
      ))}
    </Select>
  );
}
