"use client";

import { Section } from "@/components/ui/block";
import { CURRENCIES } from "@/const";
import Option from "./option";
import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";

export default function CurrencyPicker({ dict }: { dict: string }) {
  const { currency, setCurrency, setGoal, setLimit } = useAIAssistant();
  return (
    <Section title={dict}>
      <div className="flex flex-wrap items-center gap-3 col-span-full">
        {CURRENCIES.map((curr) => (
          <Option
            className="text-sm font-medium py-2"
            // highlight="outline"
            id={`context-limit-${curr}`}
            isActive={currency === curr}
            onActiveChange={() => {
              setLimit(undefined);
              setGoal(undefined);
              setCurrency(curr);
            }}
            key={`limits-${curr}`}
          >
            {curr}
          </Option>
        ))}
      </div>
    </Section>
  );
}
