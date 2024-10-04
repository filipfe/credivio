"use client";

import { Section } from "@/components/ui/block";
import { useState } from "react";
import Option from "./option";
import { Coins, Repeat, Wallet2 } from "lucide-react";

export default function OperationsContext() {
  const [selected, setSelected] = useState<Limit["period"][]>([]);

  return (
    <Section title="Operacje">
      <div className="flex flex-col sm:grid grid-cols-3 gap-3">
        <Option
          id="context-operations-incomes"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={selected.includes("daily")}
          onActiveChange={(checked) =>
            setSelected((prev) =>
              checked
                ? [...prev, "daily"]
                : prev.filter((limit) => limit !== "daily")
            )
          }
        >
          <Wallet2 size={14} />
          Przychody
        </Option>
        <Option
          id="context-operations-expenses"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={selected.includes("weekly")}
          onActiveChange={(checked) =>
            setSelected((prev) =>
              checked
                ? [...prev, "weekly"]
                : prev.filter((limit) => limit !== "weekly")
            )
          }
        >
          <Coins size={14} />
          Wydatki
        </Option>
        <Option
          id="context-operations-recurring-payments"
          className="flex items-center gap-2 font-medium text-sm select-none"
          isActive={selected.includes("monthly")}
          onActiveChange={(checked) =>
            setSelected((prev) =>
              checked
                ? [...prev, "monthly"]
                : prev.filter((limit) => limit !== "monthly")
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
