import { MutableRefObject, useEffect, useMemo, useState } from "react";

const RECHART_CERTESIAN_AXIS_TICK_VALUE_SELECTOR = `.recharts-cartesian-axis-tick-value[orientation="left"],
.recharts-cartesian-axis-tick-value[orientation="right"]`;

type Options = {
  yAxisWidthModifier?: (value: number) => number;
};

export default function useYAxisWidth(
  ref: MutableRefObject<any>,
  options?: Options
): number | undefined {
  const [width, setWidth] = useState(undefined);

  useEffect(() => {
    if (!ref.current || !ref.current.container) return;
    const tickValueElements = ref.current.container.querySelectorAll(
      RECHART_CERTESIAN_AXIS_TICK_VALUE_SELECTOR
    );
    const highestWidth = [...tickValueElements]
      .map((el) => {
        const boundingRect = el.getBoundingClientRect();
        if (boundingRect != null && boundingRect.width != null) {
          return boundingRect.width;
        }
        return 0;
      })
      .reduce((accumulator, value) => {
        if (accumulator < value) {
          return value;
        }
        return accumulator;
      }, 0);
    setWidth(highestWidth);
  }, [ref.current]);

  const yAxisWidth = useMemo(() => {
    if (!options?.yAxisWidthModifier || !width) return width;
    return options.yAxisWidthModifier(width);
  }, [options, width]);

  return yAxisWidth;
}
