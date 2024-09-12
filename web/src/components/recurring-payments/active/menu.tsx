"use client";

import { deleteRecurringPayment } from "@/lib/recurring-payments/actions";
import toast from "@/utils/toast";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { MoreVerticalIcon, PauseIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";

export default function Menu({ id }: WithId<RecurringPayment>) {
  const [isLoading, setIsLoading] = useState({
    deletion: false,
  });
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
        closeOnSelect={false}
        disabledKeys={[...(isLoading.deletion ? ["delete"] : [])]}
        onAction={async (key) => {
          switch (key) {
            case "delete":
              setIsLoading((prev) => ({ ...prev, deletion: true }));
              const formData = new FormData();
              formData.append("id", id);
              const { error } = await deleteRecurringPayment(formData);
              if (error) {
                toast({
                  type: "error",
                  message: "Wystąpił błąd przy usuwaniu płatności",
                });
              }
              setIsLoading((prev) => ({ ...prev, deletion: false }));
              break;
            default:
              break;
          }
        }}
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
