"use client";

import { getPreferences } from "@/lib/settings/actions";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type StatsFilterContextType = {
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  currency: string;
  setCurrency: Dispatch<SetStateAction<string>>;
};

export const StatsFilterContext = createContext<StatsFilterContextType>(null!);

const now = new Date();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [currency, setCurrency] = useState<string>("");

  useEffect(() => {
    const fetchPreferences = async () => {
      const { result: preferences } = await getPreferences();
      setCurrency(preferences!.currency);
    };

    fetchPreferences();
  }, []);

  return (
    <StatsFilterContext.Provider
      value={{
        month,
        setMonth,
        year,
        setYear,
        currency,
        setCurrency,
      }}
    >
      {children}
    </StatsFilterContext.Provider>
  );
}
