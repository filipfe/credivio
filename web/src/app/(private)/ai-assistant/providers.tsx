"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AIAssistantContextType = {
  limit?: Limit;
  goal?: Goal;
  setLimit: Dispatch<SetStateAction<Limit | undefined>>;
  setGoal: Dispatch<SetStateAction<Goal | undefined>>;
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
  return (
    <AIAssistantContext.Provider value={{ limit, setLimit, goal, setGoal }}>
      {children}
    </AIAssistantContext.Provider>
  );
}
