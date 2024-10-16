"use client";

import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";
import { CURRENCIES } from "@/const";
import Option from "./option";
import { Section } from "@/components/ui/block";

export default function Currencies() {
  const { currency, setCurrency, setGoal, setLimit } = useAIAssistant();

  return (
    <Section title="Waluty">
      <div className="flex flex-wrap items-center gap-3 col-span-full">
        {CURRENCIES.map((curr) => (
          <Option
            className="text-sm font-medium py-2"
            // highlight="outline"
            id={`context-limit-${curr}`}
            isActive={currency === curr}
            onActiveChange={() => {
              setGoal(undefined);
              setLimit(undefined);
              setCurrency(curr);
            }}
            key={curr}
          >
            {curr}
          </Option>
        ))}
      </div>
    </Section>
  );
}
