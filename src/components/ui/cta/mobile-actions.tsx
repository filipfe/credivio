"use client";

import { createClient } from "@/utils/supabase/client";
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
import { useEffect, useState } from "react";

export default function MobileActions() {
  const [areLoading, setAreLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("user_services")
        .select("services(href)");
      const results = data ? data.flatMap((item) => item.services) : [];
      setServices(results as Service[]);
      setAreLoading(false);
    })();
  }, []);

  return (
    <div className="fixed z-30 bottom-8 right-6 sm:hidden">
      <Dropdown
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDisabled={areLoading}
        className="fixed !right-6 !left-6 bottom-24 w-auto sm:hidden"
        disableAnimation
      >
        <DropdownTrigger>
          <Button
            variant="shadow"
            size="lg"
            color="primary"
            isIconOnly
            radius="full"
            className="[&[aria-expanded=true]]:scale-100 [&[aria-expanded=true]]:opacity-100 h-14 w-14"
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
              href="/expenses/add"
              startContent={<CoinsIcon size={16} />}
            >
              Nowy wydatek
            </DropdownItem>
            <DropdownItem
              key="new-income"
              startContent={<Wallet2Icon size={16} />}
              description="Dodaj nowy przychód"
              href="/incomes/add"
            >
              Nowy przychód
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Inwestycje">
            <DropdownItem
              description="Dodaj nową transakcję"
              key="new-stock-transaction"
              href="/stocks/transactions/add"
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
