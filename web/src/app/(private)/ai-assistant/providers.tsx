"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AIAssistantContextType = {
  currency: string;
  limit?: Limit;
  goal?: Goal;
  operations: Record<"incomes" | "expenses" | "recurring_payments", boolean>;
  setCurrency: Dispatch<SetStateAction<string>>;
  setLimit: Dispatch<SetStateAction<Limit | undefined>>;
  setGoal: Dispatch<SetStateAction<Goal | undefined>>;
  setOperations: Dispatch<
    SetStateAction<
      Record<"incomes" | "expenses" | "recurring_payments", boolean>
    >
  >;
};

const AIAssistantContext = createContext<AIAssistantContextType>(null!);

export const useAIAssistant = () => useContext(AIAssistantContext);

export default function AIAssistantProvider({
  children,
  defaultCurrency,
}: {
  children: React.ReactNode;
  defaultCurrency: string;
}) {
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const [limit, setLimit] = useState<Limit>();
  const [goal, setGoal] = useState<Goal>();
  const [operations, setOperations] = useState<
    Record<"incomes" | "expenses" | "recurring_payments", boolean>
  >({
    incomes: false,
    expenses: false,
    recurring_payments: false,
  });
  return (
    <AIAssistantContext.Provider
      value={{
        currency,
        setCurrency,
        limit,
        setLimit,
        goal,
        setGoal,
        operations,
        setOperations,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
}
