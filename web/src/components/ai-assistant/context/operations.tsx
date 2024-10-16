"use client";

import { Section } from "@/components/ui/block";
import Option from "./option";
import { Coins, Repeat, Wallet2 } from "lucide-react";
import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";

export default function OperationsContext() {
  const { selected, setSelected } = useAIAssistant();

  return (
    <Section title="Operacje">
      <div className="flex flex-col sm:grid grid-cols-3 gap-3">
        <Option
          id="context-operations-incomes"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={selected.incomes}
          onActiveChange={(checked) =>
            setSelected((prev) => ({
              ...prev,
              incomes: checked,
            }))
          }
        >
          <Wallet2 size={14} />
          Przychody
        </Option>
        <Option
          id="context-operations-expenses"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={selected.expenses}
          onActiveChange={(checked) =>
            setSelected((prev) => ({
              ...prev,
              expenses: checked,
            }))
          }
        >
          <Coins size={14} />
          Wydatki
        </Option>
        <Option
          id="context-operations-recurring-payments"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={false}
          onActiveChange={
            (checked) => ({})
            // setSelected((prev) =>
            //   checked
            //     ? [...prev, "monthly"]
            //     : prev.filter((limit) => limit !== "monthly")
            // )
          }
        >
          <Repeat size={14} />
          Płatności cykliczne
        </Option>
      </div>
    </Section>
  );
}
