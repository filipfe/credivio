"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type SelectedType = {
  incomes: boolean;
  expenses: boolean;
};

type AIAssistantContextType = {
  limit?: Limit;
  goal?: Goal;
  setLimit: Dispatch<SetStateAction<Limit | undefined>>;
  setGoal: Dispatch<SetStateAction<Goal | undefined>>;
  selected: SelectedType;
  setSelected: Dispatch<SetStateAction<SelectedType>>;
};

const AIAssistantContext = createContext<AIAssistantContextType>(null!);

export const useAIAssistant = () => useContext(AIAssistantContext);

export default function AIAssistantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [limit, setLimit] = useState<Limit>();
  const [goal, setGoal] = useState<Goal>();
  const [selected, setSelected] = useState<SelectedType>({
    incomes: false,
    expenses: false,
  });

  return (
    <AIAssistantContext.Provider
      value={{ limit, setLimit, goal, setGoal, selected, setSelected }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
}
