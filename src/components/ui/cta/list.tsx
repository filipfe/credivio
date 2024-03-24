"use client";

import { deleteRows } from "@/lib/general/actions";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { EditIcon, MoreVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

type Props = {
  id: string;
  type: string;
  onEdit?: () => void;
};

export default function CrudList({ id, type, onEdit }: Props) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
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
        onAction={async (key) => {
          setLoadingKey(key.toString());
          switch (key) {
            case "delete":
              const { error } = await deleteRows({ body: { type, data: id } });
              break;
            case "edit":
              onEdit && (await onEdit());
              break;
            case "new":
              break;
          }
          setLoadingKey(null);
        }}
      >
        <DropdownItem
          key="new"
          shortcut="⌘N"
          description="Dodaj pieniądze na cel"
          startContent={<PlusIcon size={16} />}
        >
          Dodaj
        </DropdownItem>
        <DropdownItem
          key="edit"
          shortcut="⌘N"
          description="Edytuj szczegóły wydatku"
          startContent={<EditIcon size={16} />}
          showDivider
        >
          Edytuj
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
