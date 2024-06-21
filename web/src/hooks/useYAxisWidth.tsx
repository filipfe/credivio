import { satoshi } from "@/assets/font/satoshi";
import numberFormat from "@/utils/formatters/currency";
import { useState } from "react";

const checkWidth = (label: string): number => {
  const tempElement = document.createElement("p");
  tempElement.classList.add(satoshi.className);
  tempElement.style.visibility = "hidden";
  tempElement.style.position = "absolute";
  tempElement.style.width = "max-content";
  tempElement.style.fontSize = "12px";

  tempElement.textContent = label;

  document.body.appendChild(tempElement);

  const width = tempElement.offsetWidth;

  document.body.removeChild(tempElement);
  return width;
};

export default function useYAxisWidth(currency: string) {
  const [longestTick, setLongestTick] = useState(0);
  const tickFormatter = (val: number): string => {
    const formattedTick = numberFormat(currency, val, "compact");
    const width = checkWidth(formattedTick);
    if (width > longestTick) {
      setLongestTick(width);
    }
    return formattedTick;
  };
  return {
    width: longestTick + 8.2 * 1,
    tickFormatter,
  };
}
