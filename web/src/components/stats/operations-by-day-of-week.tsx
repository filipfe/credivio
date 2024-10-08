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
  const { month, year, currency, languageCode } =
    useContext(StatsFilterContext);
  const { isLoading, data: results } = useOperationsByDayOfWeek(
    currency,
    month + 1,
    year
  );

  const formatter = new Intl.DateTimeFormat(languageCode, { weekday: "short" });

  return (
    <Block
      className="xl:col-span-3 max-h-[479px] h-[479px]"
      title="Operacje wg dnia tygodnia"
    >
      {isLoading ? (
        <LineChartLoader className="!p-0" hideTitle />
      ) : true ? (
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
      ) : (
        <Empty title="Brak danych do wyświetlenia!" />
      )}
    </Block>
  );
}
