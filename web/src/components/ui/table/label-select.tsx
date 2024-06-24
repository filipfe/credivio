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
    // <Dropdown>
    //   <DropdownTrigger>
    //     <Button
    //       size="sm"
    //       endContent={<ChevronDownIcon size={16} />}
    //       disableAnimation
    //       variant="flat"
    //       className="bg-light !h-9"
    //     >
    //       {value ? value : "Wybierz etykietę"}
    //     </Button>
    //   </DropdownTrigger>
    //   <DropdownMenu
    //     emptyContent="Brak etykiet!"
    //     aria-label="Label filter"
    //     selectedKeys={[value] as string[]}
    //     selectionMode="single"
    //     onSelectionChange={(keys) => {
    //       const selectedKey = Array.from(keys)[0]?.toString();
    //       onChange(selectedKey === "all" ? "" : selectedKey);
    //     }}
    //   >
    //     {
    //       (value && (
    //         <DropdownItem className="!bg-white hover:!bg-light" key="all">
    //           Wszystkie
    //         </DropdownItem>
    //       )) as any
    //     }
    //     {labels.map(({ name, count }) => (
    //       <DropdownItem
    //         className={`${
    //           value === name ? "!bg-light" : "!bg-white hover:!bg-light"
    //         }`}
    //         title={name}
    //         description={`${count} wydatków`}
    //         key={name}
    //       />
    //     ))}
    //   </DropdownMenu>
    // </Dropdown>

    <Select
      name="label"
      placeholder="Jedzenie"
      aria-label="Label filter"
      label="Etykieta"
      size="sm"
      selectedKeys={[value]}
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
            value=""
            className={`${
              value === "" ? "!bg-light" : "!bg-white hover:!bg-light"
            }`}
            key=""
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
