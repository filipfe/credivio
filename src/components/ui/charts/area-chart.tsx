"use client";

import {
  ResponsiveContainer,
  LineChart as LineChartWrapper,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
} from "recharts";

type Props = {
  data: Option<number>[];
};

export default function AreaChart({ data }: Props) {
  const numberFormat = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    notation: "compact",
  });
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChartWrapper
        data={data.sort((a, b) => b.value - a.value).slice(0, 4)}
        margin={{ top: 0, left: 5, right: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="area-chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#177981" stopOpacity={1} />
            <stop offset="95%" stopColor="#fdbb2d" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          dataKey="value"
          tickFormatter={(value) => numberFormat.format(value)}
        />
        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
        <Line dataKey="value" stroke="#177981" strokeWidth={2}></Line>
      </LineChartWrapper>
    </ResponsiveContainer>
  );
}
