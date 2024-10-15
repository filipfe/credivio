"use client";

import { useContext } from "react";
import Block from "../ui/block";
import Empty from "../ui/empty";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import { useOperationsByDayOfWeek } from "@/lib/stats/queries";
import LineChartLoader from "../ui/charts/line-loader";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export default function OperationsByDayOfWeek() {
  const { month, year, currency, settings } = useContext(StatsFilterContext);
  const { isLoading, data: results } = useOperationsByDayOfWeek(
    currency,
    month + 1,
    year
  );

  const formatter = new Intl.DateTimeFormat(settings.language, {
    weekday: "short",
  });

  return (
    <Block className="col-span-2" title="Operacje wg dnia tygodnia">
      <div className="flex max-h-[361px] h-[361px] w-full justify-between">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={results}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="day_of_week"
              tickFormatter={(dayNumber) => {
                const date = new Date(2023, 0, dayNumber + 1);
                return formatter.format(date);
              }}
            />
            <PolarRadiusAxis
              angle={65}
              domain={[-1, "auto"]}
              tick={false}
              axisLine={false}
            />
            <Radar
              isAnimationActive={false}
              name="Przychody"
              dataKey="total_incomes"
              stroke="#177981"
              fill="#177981"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={results}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="day_of_week"
              tickFormatter={(dayNumber) => {
                const date = new Date(2023, 0, dayNumber + 1);
                return formatter.format(date);
              }}
            />
            <PolarRadiusAxis
              angle={65}
              domain={[-1, "auto"]}
              tick={false}
              axisLine={false}
            />
            <Radar
              isAnimationActive={false}
              name="Wydatki"
              dataKey="total_expenses"
              stroke="#fdbb2d"
              fill="#fdbb2d"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Block>
  );
}
