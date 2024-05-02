"use client";

import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { ListFilterIcon, ListRestartIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CurrencySelect from "./currency-select";
import LabelSelect from "./label-select";

export default function Filter({
  enabled = { label: false, currency: true },
  state,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const numberOfParams = Array.from(searchParams.keys()).filter(
    (item) => item !== "page"
  ).length;

  const isFiltered = Object.keys(state).some(
    (key) => state[key as keyof typeof state]?.value !== ""
  );
  return (
    <Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div>
          <Badge
            content={numberOfParams}
            isInvisible={numberOfParams === 0}
            color="primary"
            size="lg"
          >
            <Button
              isIconOnly
              disableRipple
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <ListFilterIcon size={16} />
            </Button>
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="flex flex-col gap-2 py-2 w-full">
          {enabled.label && state.label && <LabelSelect {...state.label} />}
          {enabled.currency && state.currency && (
            <CurrencySelect {...state.currency} />
          )}
          {isFiltered && (
            <Button
              size="sm"
              onClick={() => {
                Object.keys(state).forEach((key) => {
                  const value = state[key as keyof typeof state];
                  value && value.onChange("");
                });
              }}
            >
              <ListRestartIcon size={15} strokeWidth={2} /> Resetuj
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
