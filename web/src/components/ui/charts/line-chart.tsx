"use client";

import {
  ResponsiveContainer,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  LineChart as Chart,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import ChartTooltip from "./tooltip";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { PeriodContext } from "@/app/(private)/(operations)/providers";

type Props = {
  data: DailyAmount[];
  currency: string;
  type: string;
};

export default function LineChart({ data, currency, type }: Props) {
  const { period, setPeriod } = useContext(PeriodContext);
  const { width, tickFormatter } = useYAxisWidth(currency);

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={320}>
      <Chart
        data={data}
        margin={{ top: 16, right: 20 }}
        onClick={({ activeLabel }) =>
          activeLabel && setPeriod({ from: activeLabel, to: activeLabel })
        }
      >
        <YAxis
          width={width}
          tick={{ fontSize: 12 }}
          dataKey="total_amount"
          tickCount={8}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
        />
        <XAxis
          tickMargin={8}
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(label) => {
            const [year, month, day] = label.split("-");
            return new Intl.DateTimeFormat("pl-PL", {
              day: "2-digit",
              month: "short",
            }).format(new Date(year, parseInt(month) - 1, day));
          }}
          minTickGap={32}
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
          isAnimationActive={false}
          contentStyle={{ backgroundColor: "#177981" }}
          labelFormatter={(label) => {
            const [year, month, day] = label.split("-");
            return new Intl.DateTimeFormat("pl-PL", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date(year, parseInt(month) - 1, day));
          }}
          content={(props) => (
            <ChartTooltip
              {...props}
              payloadName={
                type === "budget"
                  ? "Budżet"
                  : type === "income"
                  ? "Przychody"
                  : "Wydatki"
              }
              currency={currency}
            />
          )}
        />
        <Line
          isAnimationActive={false}
          dataKey="total_amount"
          stroke="#177981"
          strokeWidth={2}
          fillOpacity={1}
          dot={false}
        />
        {period && (
          <ReferenceLine
            x={period.from}
            stroke="#fdbb2d"
            strokeWidth={2}
            strokeOpacity={0.6}
          />
        )}
        {period && period.from !== period.to && (
          <ReferenceLine
            x={period.to}
            stroke="#fdbb2d"
            strokeWidth={2}
            strokeOpacity={0.6}
          />
        )}
        {period && period.from !== period.to && (
          <ReferenceArea
            x1={period.from}
            x2={period.to}
            fill="#fdbb2d"
            fillOpacity={0.2}
          />
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
