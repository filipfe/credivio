import { Select, SelectItem } from "@nextui-org/react";
import { useLabels } from "@/lib/operations/queries";
import { Dict } from "@/const/dict";

export default function LabelSelect({
  dict,
  value,
  onChange,
}: State & {
  dict: Dict["private"]["operations"]["operation-table"]["top-content"]["filter"]["label"];
}) {
  const { data: labels, isLoading } = useLabels();

  return (
    <Select
      name="label"
      aria-label="Label filter"
      label={dict.label}
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
            value={dict.default}
            className={`${
              value === "" ? "!bg-light" : "!bg-white hover:!bg-light"
            }`}
            key="all"
          >
            {dict.default}
          </SelectItem>
        ) as any
      }
      {labels
        ? labels.map(({ name, count }) => (
            <SelectItem
              value={name}
              description={`${count} ${dict.description}`}
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
