"use client";

import {
  ResponsiveContainer,
  PieChart as PieChartWrapper,
  Pie,
} from "recharts";

type Props = {
  data: Option[];
};

export default function PieChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChartWrapper>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          // fill="#177981"
          // label={({ payload }) => payload.name}
        />
      </PieChartWrapper>
    </ResponsiveContainer>
  );
}
