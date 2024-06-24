import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { MoreVerticalIcon, PauseIcon, Trash2Icon } from "lucide-react";

export default function Menu() {
  return (
    <Dropdown shadow="sm" placement="bottom-end">
      <DropdownTrigger>
        <button className="h-6 w-6 rounded-full grid place-content-center">
          <MoreVerticalIcon size={20} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        variant="faded"
        aria-label="Dropdown menu with description for recurring payments"
      >
        <DropdownItem
          key="pause"
          description="Tymczasowo przerwij płatność"
          startContent={<PauseIcon size={16} />}
          closeOnSelect={false}
          showDivider
        >
          Przerwij płatność
        </DropdownItem>
        <DropdownItem
          closeOnSelect={false}
          key="delete"
          className="text-danger"
          color="danger"
          description="Nieodwracalnie usuń płatność"
          startContent={<Trash2Icon className="text-danger" size={16} />}
        >
          Usuń płatność
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
