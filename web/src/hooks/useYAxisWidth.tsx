import { satoshi } from "@/assets/font/satoshi";
import { usePreferences } from "@/lib/settings/queries";
import { useCallback, useState } from "react";

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

export default function useYAxisWidth(
  currency?: string,
  formatter?: (value: number) => string
) {
  const { data: preferences } = usePreferences();
  const [longestTick, setLongestTick] = useState(0);
  const tickFormatter = useCallback(
    (val: number): string => {
      const formattedTick = formatter
        ? formatter(val)
        : currency
        ? new Intl.NumberFormat(preferences?.language.code, {
            style: "currency",
            currency,
            notation: "compact",
          }).format(val)
        : val.toString();
      const width = checkWidth(formattedTick);
      if (width > longestTick) {
        setLongestTick(width);
      }
      return formattedTick;
    },
    [currency, formatter, longestTick]
  );
  return {
    width: longestTick + 8.2 * 1,
    tickFormatter,
  };
}
