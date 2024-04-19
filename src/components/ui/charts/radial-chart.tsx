"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type Data = {
  value: number;
}[];

export default function RadialChart({ data }: { data: Data }) {
  return (
    <ResponsiveContainer>
      <RadialBarChart
        innerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={1}
          tick={false}
        />
        <RadialBar dataKey="value" fill="#177981" background angleAxisId={1} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
