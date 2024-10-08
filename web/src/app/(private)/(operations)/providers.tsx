"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

type PeriodContextType = {
  period: Period;
  setPeriod: Dispatch<SetStateAction<Period>>;
};

export const PeriodContext = createContext<PeriodContextType>(null!);

export default function Providers({
  children,
  defaultPeriod,
}: {
  children: React.ReactNode;
  defaultPeriod: Period;
}) {
  const [period, setPeriod] = useState(defaultPeriod || { from: "", to: "" });

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
