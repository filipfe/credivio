"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

type StatsFilterContextType = {
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  currency: string;
  setCurrency: Dispatch<SetStateAction<string>>;
  languageCode: string;
};

export const StatsFilterContext = createContext<StatsFilterContextType>(null!);

const now = new Date();

export default function Providers({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: Settings;
}) {
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [currency, setCurrency] = useState<string>(settings.currency);
  const languageCode = settings.language;

  return (
    <StatsFilterContext.Provider
      value={{
        month,
        setMonth,
        year,
        setYear,
        currency,
        setCurrency,
        languageCode,
      }}
    >
      {children}
    </StatsFilterContext.Provider>
  );
}
