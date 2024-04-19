"use client";

import {
  ResponsiveContainer,
  PieChart as PieChartWrapper,
  Pie,
  Cell,
} from "recharts";

type Props = {
  data: Group[];
  height?: number;
  legend?: boolean;
};

export default function PieChart({ data, legend, height }: Props) {
  return (
    <div className="flex flex-col items-center" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChartWrapper>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%">
            {data.map((item, k) => (
              <Cell
                fill={k % 2 === 0 ? "#177981" : "#ffc000"}
                key={item.name}
              />
            ))}
          </Pie>
        </PieChartWrapper>
      </ResponsiveContainer>
      {legend && (
        <div className="flex items-center gap-4 flex-wrap">
          {data.map((item) => (
            <LegendRef {...item} key={item.name} />
          ))}
        </div>
      )}
    </div>
  );
}

const LegendRef = ({ color, label }: Group) => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-4 rounded" style={{ backgroundColor: color }}></div>
    <span className="text-sm">{label}</span>
  </div>
);
