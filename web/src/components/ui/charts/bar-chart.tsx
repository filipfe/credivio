"use client";

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

type Props = {
  data: ChartLabel[];
  defaultCurrency: string;
};

const renderCustomBarLabel = ({
  payload: _payload,
  x,
  y,
  width,
  height: _height,
  value,
  defaultCurrency,
}: any) => {
  const numberFormat = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: defaultCurrency,
  });

  return (
    <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
      {numberFormat.format(value)}
    </text>
  );
};

export default function BarChart({ data, defaultCurrency }: Props) {
  const numberFormat = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: defaultCurrency,
    notation: "compact",
  });
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChartWrapper
        data={data}
        margin={{ top: 5, left: 8, right: 36, bottom: 0 }}
      >
        <CartesianGrid vertical={false} opacity={0.5} />
        <YAxis
          tick={{ fontSize: 12 }}
          dataKey="total_amount"
          tickFormatter={(value) => numberFormat.format(value)}
          axisLine={false}
          tickLine={false}
        />
        <XAxis
          interval={0}
          dataKey="name"
          tick={{ fontSize: 14 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar
          maxBarSize={120}
          dataKey="total_amount"
          radius={[24, 24, 0, 0]}
          label={(e) => renderCustomBarLabel({ ...e, defaultCurrency })}
        >
          {data.map((item, k) => (
            <Cell fill={k % 2 === 0 ? "#177981" : "#ffc000"} key={item.name} />
          ))}
        </Bar>
      </BarChartWrapper>
    </ResponsiveContainer>
  );
}
