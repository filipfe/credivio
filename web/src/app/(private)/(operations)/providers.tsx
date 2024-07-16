"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

type PeriodContextType = {
  period: Period;
  setPeriod: Dispatch<SetStateAction<Period>>;
};

export const PeriodContext = createContext<PeriodContextType>(null!);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState({
    from: "",
    to: "",
  });

  return (
    <PeriodContext.Provider
      value={{
        period,
        setPeriod,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
}
