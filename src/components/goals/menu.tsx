"use client";

import { deleteRows, updateRow } from "@/lib/general/actions";
import { TimelineContext } from "@/providers/goals/timeline";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  AlertOctagonIcon,
  LocateIcon,
  MoreVerticalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Key, useContext, useState } from "react";

type Props = {
  id: string;
  type: string;
  onAdd?: () => void;
};

export default function Menu({ id, type, onAdd }: Props) {
  const { setActiveRecord } = useContext(TimelineContext);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  async function onAction(key: Key) {
    setLoadingKey(key.toString());
    switch (key) {
      case "add":
        onAdd && onAdd();
        break;
      case "priority":
        const { error: updateError } = await updateRow(id, "goal", {
          is_priority: true,
        });
        console.log(updateError);
      case "locate":
        setActiveRecord(id);
        break;

      case "delete":
        const { error: deleteError } = await deleteRows({
          body: { type, data: id },
        });
        break;
    }
    setLoadingKey(null);
  }

  return (
    <Dropdown shadow="sm">
      <DropdownTrigger>
        <Button variant="light" isIconOnly className="rounded-full" size="sm">
          <MoreVerticalIcon size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disabledKeys={loadingKey ? [loadingKey] : []}
        variant="faded"
        aria-label="Dropdown menu with description"
        onAction={onAction}
      >
        <DropdownItem
          key="add"
          shortcut="⌘N"
          description="Dodaj pieniądze na cel"
          startContent={<PlusIcon size={16} />}
        >
          Dodaj
        </DropdownItem>
        <DropdownItem
          key="priority"
          shortcut="⌘N"
          description="Ustaw ten cel jako priorytet"
          startContent={<AlertOctagonIcon size={16} />}
          closeOnSelect={false}
        >
          Ustaw priorytet
        </DropdownItem>
        <DropdownItem
          key="locate"
          shortcut="⌘N"
          description="Pokaż element na osi czasu"
          startContent={<LocateIcon size={16} />}
          showDivider
        >
          Zaznacz na osi
        </DropdownItem>
        <DropdownItem
          closeOnSelect={false}
          key="delete"
          className="text-danger"
          color="danger"
          shortcut="⌘⇧D"
          description="Nieodwracalnie usuń cel"
          startContent={<Trash2Icon className="text-danger" size={16} />}
        >
          Usuń cel
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
