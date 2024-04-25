"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  AlignHorizontalDistributeCenterIcon,
  CoinsIcon,
  PlusIcon,
  Wallet2Icon,
} from "lucide-react";
import { useState } from "react";

export default function MobileActions() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed z-30 bottom-4 right-6 sm:hidden">
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} closeOnSelect={false}>
        <DropdownTrigger>
          <Button
            variant="shadow"
            size="lg"
            color="primary"
            isIconOnly
            radius="full"
          >
            <PlusIcon
              size={24}
              className={`transition-transform ${
                isOpen ? "rotate-45" : "rotate-0"
              }`}
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu for actions">
          <DropdownSection title="Operacje" showDivider>
            <DropdownItem
              description="Dodaj nowy wydatek"
              key="new-expense"
              startContent={<CoinsIcon size={16} />}
            >
              Nowy wydatek
            </DropdownItem>
            <DropdownItem
              key="new-income"
              startContent={<Wallet2Icon size={16} />}
              description="Dodaj nowy przychód"
            >
              Nowy przychód
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Inwestycje">
            <DropdownItem
              description="Dodaj nową transakcję"
              key="new-stock-transaction"
              startContent={<AlignHorizontalDistributeCenterIcon size={16} />}
            >
              Nowa akcja
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
