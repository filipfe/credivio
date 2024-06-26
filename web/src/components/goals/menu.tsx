"use client";

import { deleteRows, updateRow } from "@/lib/general/actions";
import { TimelineContext } from "@/app/(private)/goals/providers";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  AlertOctagonIcon,
  MoreVerticalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Key, useContext, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  goal: Goal;
  onAdd?: () => void;
};

export default function Menu({ goal, onAdd }: Props) {
  const { activeRecord, setActiveRecord } = useContext(TimelineContext);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  async function onAction(key: Key) {
    setLoadingKey(key.toString());
    switch (key) {
      case "add":
        onAdd && onAdd();
        break;
      case "priority":
        const { error: updateError } = await updateRow(goal.id, "goal", {
          is_priority: true,
        });
        updateError && toast.error(updateError.message);
        setActiveRecord((prev) =>
          prev ? { ...prev, is_priority: true } : prev
        );
        break;
      case "delete":
        const { error: deleteError } = await deleteRows({
          body: { type: "goal", data: goal.id },
        });
        deleteError && toast.error(deleteError);
        break;
    }
    setLoadingKey(null);
  }

  const disabledKeys: string[] = [
    ...(loadingKey ? [loadingKey] : []),
    ...(!goal.deadline || activeRecord?.id === goal.id ? ["locate"] : []),
    ...(goal.is_priority ? ["priority"] : []),
  ];

  return (
    <Dropdown shadow="sm">
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
