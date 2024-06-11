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

type Props = {
  data: ChartLabel[];
  currency: string;
};

export default function BarChart({ data, currency }: Props) {
  const { width, tickFormatter } = useYAxisWidth(currency);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartWrapper
        data={data}
        margin={{ top: 16, left: 8, right: 36, bottom: 0 }}
      >
        <CartesianGrid vertical={false} opacity={0.5} />
        <YAxis
          width={width}
          tick={{ fontSize: 12 }}
          dataKey="total_amount"
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
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
