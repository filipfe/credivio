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
import { Dispatch, memo, SetStateAction, useContext } from "react";
import { PeriodContext } from "@/app/(private)/(operations)/providers";
import { isToday } from "date-fns";

type Props = {
  data: DailyAmount[];
  currency: string;
  type: string;
  period?: Period;
  setPeriod?: Dispatch<SetStateAction<Period>>;
};

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "long",
});

export default function LineChart({
  data,
  currency,
  type,
  period,
  setPeriod,
}: Props) {
  const { width, tickFormatter } = useYAxisWidth(currency);

  const isFromEarlier = period
    ? new Date(period.from).getTime() < new Date(data[0].date).getTime()
    : false;

  const isToLater = period
    ? new Date(period.to).getTime() >
      new Date(data[data.length - 1].date).getTime()
    : false;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={320}>
      <Chart
        data={data}
        margin={{ top: 16, right: 20 }}
        onClick={({ activeLabel }) =>
          activeLabel &&
          setPeriod &&
          setPeriod({ from: activeLabel, to: activeLabel })
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

        {period &&
          period.from &&
          period.to &&
          (period.from === period.to ? (
            <ReferenceLine
              x={period.to}
              stroke="#fdbb2d"
              strokeWidth={2}
              strokeOpacity={0.6}
              label={{
                position: "top",
                value: isToday(period.to)
                  ? "Dzisiaj"
                  : dateFormatter.format(new Date(period.to)),
                fill: "#fdbb2d",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
          ) : (
            <ReferenceArea
              x1={isFromEarlier ? data[0].date : period.from}
              x2={period.to}
              fill="#fdbb2d"
              fillOpacity={0.25}
              label={{
                position: "top",
                value: `${dateFormatter.format(
                  new Date(period.from)
                )} - ${dateFormatter.format(new Date(period.to))}`,
                fontSize: 12,
                fontWeight: 500,
                fill: "#fdbb2d",
              }}
            />
          ))}
        {period && period.from && !isFromEarlier && (
          <ReferenceLine
            x={period.from}
            stroke="#fdbb2d"
            strokeWidth={2}
            strokeOpacity={0.6}
          />
        )}
        {period && period.to && !isToLater && (
          <ReferenceLine
            x={period.to}
            stroke="#fdbb2d"
            strokeWidth={2}
            strokeOpacity={0.6}
          />
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
