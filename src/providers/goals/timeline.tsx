"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

type TimelineContextType = {
  activeRecord: string | null;
  setActiveRecord: Dispatch<SetStateAction<string | null>>;
};

export const TimelineContext = createContext<TimelineContextType>(null!);

export default function TimelineProvider({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [activeRecord, setActiveRecord] = useState<string | null>(null);
  return (
    <TimelineContext.Provider value={{ activeRecord, setActiveRecord }}>
      {children}
    </TimelineContext.Provider>
  );
}
