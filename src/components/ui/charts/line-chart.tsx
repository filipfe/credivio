"use client";

import {
  ResponsiveContainer,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  LineChart,
} from "recharts";

type Props = {
  data: DailyAmount[];
};

export default function AreaChart({ data }: Props) {
  const compact = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    notation: "compact",
  });
  const standard = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    notation: "standard",
  });

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart
        data={data.map((e) => e)}
        margin={{ top: 5, left: 12, right: 36, bottom: 0 }}
      >
        <defs>
          <linearGradient id="area-chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#177981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#177981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis
          tick={{ fontSize: 12 }}
          dataKey="total_amount"
          tickFormatter={(value) => compact.format(value)}
          axisLine={false}
          tickLine={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.substring(0, 5).replace("-", ".")}
          interval={2}
          axisLine={false}
          tickLine={false}
        />
        <CartesianGrid
          opacity={0.6}
          strokeWidth={1}
          vertical={false}
          className="stroke-content4"
        />
        <Tooltip
          formatter={(value) => [
            standard.format(parseFloat(value.toString())),
            "Budżet",
          ]}
        />
        <Line
          dataKey="total_amount"
          stroke="#177981"
          strokeWidth={2}
          fillOpacity={1}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
