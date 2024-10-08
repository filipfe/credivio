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
  preferences,
}: {
  children: React.ReactNode;
  preferences: Preferences;
}) {
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [currency, setCurrency] = useState<string>(preferences.currency);
  const languageCode = preferences.language.code;

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
