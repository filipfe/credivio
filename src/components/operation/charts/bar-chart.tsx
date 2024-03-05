"use client";

import {
  ResponsiveContainer,
  BarChart as BarChartWrapper,
  Bar,
  CartesianGrid,
  YAxis,
  XAxis,
  Cell,
  Legend,
} from "recharts";

type Props = {
  data: Option[];
};

export default function BarChart({ data }: Props) {
  const numberFormat = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    notation: "compact",
  });
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChartWrapper
        data={data.sort((a, b) => b.value - a.value)}
        margin={{ top: 0, left: 5, right: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          dataKey="value"
          tickFormatter={(value) => numberFormat.format(value)}
        />
        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
        <Bar dataKey="value" radius={[24, 24, 0, 0]}>
          {data.map((item, k) => (
            <Cell fill={k % 2 === 0 ? "#177981" : "#ffc000"} key={item.name} />
          ))}
        </Bar>
      </BarChartWrapper>
    </ResponsiveContainer>
  );
}
