"use client";

import {
  ResponsiveContainer,
  LineChart as LineChartWrapper,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
  AreaChart as AreaChartRecharts,
  Tooltip,
  Area,
  LineChart,
} from "recharts";

type Props = {
  data: DailyAmount[];
};

export default function AreaChart({ data }: Props) {
  const numberFormat = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    notation: "compact",
  });

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart
        data={data.map((e) => e)}
        margin={{ top: 5, left: 0, right: 30, bottom: 0 }}
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
          tickFormatter={(value) => numberFormat.format(value)}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.substring(0, 5).replace("-", ".")}
          interval={2}
        />
        <CartesianGrid opacity={0.5} strokeWidth={1} />
        <Tooltip
          formatter={(value, name, props) => [value + " zł", "Budżet"]}
        />
        <Line
          type="monotone"
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