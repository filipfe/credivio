"use client";

import { Section } from "@/components/ui/block";
import Option from "./option";
import { Coins, Repeat, Wallet2 } from "lucide-react";
import { useAIAssistant } from "@/app/(private)/ai-assistant/providers";

export default function OperationsContext() {
  const { operations, setOperations } = useAIAssistant();
  return (
    <Section title="Operacje">
      <div className="flex flex-col sm:grid grid-cols-3 gap-3">
        <Option
          id="context-operations-incomes"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={operations.incomes}
          onActiveChange={(checked) =>
            setOperations((prev) =>
              checked ? { ...prev, incomes: true } : { ...prev, incomes: false }
            )
          }
        >
          <Wallet2 size={14} />
          Przychody
        </Option>
        <Option
          id="context-operations-expenses"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={operations.expenses}
          onActiveChange={(checked) =>
            setOperations((prev) =>
              checked
                ? { ...prev, expenses: true }
                : { ...prev, expenses: false }
            )
          }
        >
          <Coins size={14} />
          Wydatki
        </Option>
        <Option
          id="context-operations-recurring-payments"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={operations.recurring_payments}
          onActiveChange={(checked) =>
            setOperations((prev) =>
              checked
                ? { ...prev, recurring_payments: true }
                : { ...prev, recurring_payments: false }
            )
          }
        >
          <Repeat size={14} />
          Płatności cykliczne
        </Option>
      </div>
    </Section>
  );
}
