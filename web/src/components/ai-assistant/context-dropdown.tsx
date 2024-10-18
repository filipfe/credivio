"use client";

import { useAIAssistant } from "@/app/(private)/(sidebar)/ai-assistant/providers";
import { Dict } from "@/const/dict";
import { cn } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";

export default function ContextDropdown({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: Dict["private"]["operations"]["expenses"]["limits"]["modal"]["form"]["period"]["values"];
}) {
  const { operations, goal, limit } = useAIAssistant();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="absolute top-6 left-6 right-6 z-10 bg-white border rounded-md xl:hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-5 h-12 flex items-center gap-4"
      >
        <h3 className="text-sm font-medium">Kontekst</h3>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2">
            {operations.incomes && (
              <div className="border rounded-full py-1 px-2 flex items-center gap-2">
                <div className="bg-primary rounded-full h-1.5 w-1.5 min-w-1.5"></div>
                <span className="text-xs leading-none whitespace-nowrap">
                  Przychody
                </span>
              </div>
            )}
            {operations.expenses && (
              <div className="border rounded-full py-1 px-2 flex items-center gap-2">
                <div className="bg-primary rounded-full h-1.5 w-1.5 min-w-1.5"></div>
                <span className="text-xs leading-none whitespace-nowrap">
                  Wydatki
                </span>
              </div>
            )}
            {operations.recurring_payments && (
              <div className="border rounded-full py-1 px-2 flex items-center gap-2">
                <div className="bg-primary rounded-full h-1.5 w-1.5 min-w-1.5"></div>
                <span className="text-xs leading-none whitespace-nowrap">
                  Płatności cykliczne
                </span>
              </div>
            )}
            {limit && (
              <div className="border rounded-full py-1 px-2 flex items-center gap-2">
                <div className="bg-primary rounded-full h-1.5 w-1.5 min-w-1.5"></div>
                <span className="text-xs leading-none whitespace-nowrap">
                  {dict[limit.period]}
                </span>
              </div>
            )}
            {goal && (
              <div className="border rounded-full py-1 px-2 flex items-center gap-2">
                <div className="bg-primary rounded-full h-1.5 w-1.5 min-w-1.5"></div>
                <span className="text-xs leading-none whitespace-nowrap">
                  Cel - {goal.title}
                </span>
              </div>
            )}
          </div>
        </div>
        <ChevronRight
          size={16}
          className={cn(
            "transition-transform",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden px-5">{children}</div>
      </div>
    </div>
  );
}
