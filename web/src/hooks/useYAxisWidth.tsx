import numberFormat from "@/utils/formatters/currency";
import { useState } from "react";

export default function useYAxisWidth(currency: string) {
  const [longestTick, setLongestTick] = useState("");
  const tickFormatter = (val: number): string => {
    const formattedTick = numberFormat(currency, val, "compact");
    if (longestTick.length < formattedTick.length) {
      setLongestTick(formattedTick);
    }
    return formattedTick;
  };
  console.log(longestTick);
  return {
    width: longestTick.length * 5 + 8,
    tickFormatter,
  };
}
