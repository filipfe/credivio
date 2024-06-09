"use client";

import numberFormat from "@/utils/formatters/currency";
import {
  ResponsiveContainer,
  BarChart as BarChartWrapper,
  Bar,
  CartesianGrid,
  YAxis,
  XAxis,
  Cell,
  Tooltip,
} from "recharts";
import ChartTooltip from "./tooltip";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { useRef } from "react";

type Props = {
  data: ChartLabel[];
  currency: string;
};

// const renderCustomBarLabel = ({
//   payload: _payload,
//   x,
//   y,
//   width,
//   height: _height,
//   value,
//   currency,
// }: any) => {
//   return (
//     <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
//       {numberFormat(currency, value)}
//     </text>
//   );
// };

export default function BarChart({ data, currency }: Props) {
  const ref = useRef<any>(null);
  const width = useYAxisWidth(ref);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartWrapper
        ref={ref}
        data={data}
        margin={{ top: 16, left: 8, right: 36, bottom: 0 }}
      >
        <CartesianGrid vertical={false} opacity={0.5} />
        <YAxis
          width={width}
          tick={{ fontSize: 12 }}
          dataKey="total_amount"
          tickFormatter={(value) => numberFormat(currency, value, "compact")}
          axisLine={false}
          tickLine={false}
        />
        <XAxis
          interval={0}
          dataKey="name"
          tick={{
            fontSize: 14,
            fontWeight: 500,
            opacity: 0.8,
          }}
          tickSize={12}
          axisLine={false}
          tickLine={false}
        />
        <Bar maxBarSize={120} dataKey="total_amount" radius={[24, 24, 0, 0]}>
          {data.map((item, k) => (
            <Cell
              className={`transition-colors ${
                k % 2 === 0
                  ? "fill-primary hover:fill-primary/90"
                  : "fill-secondary hover:fill-secondary/90"
              }`}
              key={item.name}
            />
          ))}
        </Bar>
        <Tooltip
          isAnimationActive={false}
          shared={false}
          contentStyle={{ backgroundColor: "#177981" }}
          labelFormatter={(label) => label}
          content={(props) => (
            <ChartTooltip
              {...props}
              payloadName="Wydatki"
              currency={currency}
            />
          )}
        />
      </BarChartWrapper>
    </ResponsiveContainer>
  );
}
