"use client";

import { deleteRows } from "@/lib/general/actions";
import { updateAsPriority } from "@/lib/goals/actions";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import {
  AlertOctagonIcon,
  MoreVerticalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Key, useState } from "react";
import toast from "react-hot-toast";
import Toast from "../ui/toast";

type Props = {
  goal: Goal;
  onAdd?: () => void;
};

export default function Menu({ goal, onAdd }: Props) {
  const { isOpen, onClose, onOpenChange } = useDisclosure();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  async function onAction(key: Key) {
    setLoadingKey(key.toString());
    switch (key) {
      case "add":
        onAdd && onAdd();
        onClose();
        break;
      case "priority":
        const { error: updateError } = await updateAsPriority(goal.id);
        updateError &&
          toast.custom((t) => (
            <Toast {...t} type="error" message={updateError} />
          ));
        onClose();
        break;
      case "delete":
        const { error: deleteError } = await deleteRows([goal.id], "goal");
        deleteError &&
          toast.custom((t) => (
            <Toast {...t} type="error" message={deleteError} />
          ));
        onClose();
        break;
    }
    setLoadingKey(null);
  }

  const disabledKeys: string[] = [
    ...(loadingKey ? [loadingKey] : []),
    ...(goal.is_priority ? ["priority"] : []),
  ];

  return (
    <Dropdown shadow="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
      <DropdownTrigger>
        <button className="h-6 w-6 rounded-full grid place-content-center">
          <MoreVerticalIcon size={20} className="text-white" />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        disabledKeys={disabledKeys}
        variant="faded"
        aria-label="Dropdown menu with description"
        onAction={onAction}
        closeOnSelect={false}
      >
        <DropdownItem
          key="add"
          description="Dodaj pieniądze na cel"
          startContent={<PlusIcon size={16} />}
        >
          Dodaj
        </DropdownItem>
        <DropdownItem
          key="priority"
          description="Ustaw ten cel jako priorytet"
          startContent={<AlertOctagonIcon size={16} />}
          closeOnSelect={false}
          showDivider
        >
          Ustaw priorytet
        </DropdownItem>
        <DropdownItem
          closeOnSelect={false}
          key="delete"
          className="text-danger"
          color="danger"
          description="Nieodwracalnie usuń cel"
          startContent={<Trash2Icon className="text-danger" size={16} />}
        >
          Usuń cel
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
