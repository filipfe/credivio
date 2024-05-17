"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

type TimelineContextType = {
  activeRecord: Goal | null;
  setActiveRecord: Dispatch<SetStateAction<Goal | null>>;
};

export const TimelineContext = createContext<TimelineContextType>(null!);

export default function TimelineProvider({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [activeRecord, setActiveRecord] = useState<Goal | null>(null);
  return (
    <TimelineContext.Provider value={{ activeRecord, setActiveRecord }}>
      {children}
    </TimelineContext.Provider>
  );
}
