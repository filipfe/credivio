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
import { Dispatch, SetStateAction, useMemo } from "react";
import { isToday } from "date-fns";
import { COLORS } from "@/const";

type Props = {
  data: DailyAmount[];
  type: string;
  currency?: string;
  period?: Period;
  setPeriod?: Dispatch<SetStateAction<Period>>;
  minHeight?: number;
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
  minHeight = 320,
}: Props) {
  const { width, tickFormatter } = useYAxisWidth(currency);

  const isFromEarlier = period
    ? new Date(period.from).getTime() < new Date(data[0].date).getTime()
    : false;

  const isToLater = period
    ? new Date(period.to).getTime() >
      new Date(data[data.length - 1].date).getTime()
    : false;

  const { currencies, dates } = useMemo(() => {
    const currencies: string[] = [];
    const dates = data.map(
      ({ date, total_amounts }) =>
        ({
          date,
          ...total_amounts.reduce((prev, { amount, currency }) => {
            !currencies.includes(currency) && currencies.push(currency);
            return {
              ...prev,
              [currency]: (prev[currency] || 0) + amount,
            };
          }, {} as Record<string, number>),
        } as { date: string } & Record<string, number>)
    );
    return {
      currencies,
      dates,
    };
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={minHeight}>
      <Chart
        data={dates.map((day) => {
          const notIncluded = currencies
            .filter((curr) => !Object.keys(day).includes(curr))
            .reduce(
              (prev, curr) => ({ ...prev, [curr]: 0 }),
              {} as Record<string, number>
            );
          return {
            ...day,
            ...notIncluded,
          };
        })}
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
          tickCount={8}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
          type="number"
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
          type="category"
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
          content={(props) => (
            <ChartTooltip
              {...props}
              label={
                props.label
                  ? new Intl.DateTimeFormat("pl-PL", {
                      dateStyle: "full",
                    }).format(new Date(props.label))
                  : undefined
              }
              payloadName={
                type === "balance"
                  ? "Balans"
                  : type === "income"
                  ? "Przychody"
                  : "Wydatki"
              }
            />
          )}
        />
        {currencies.map((currency, k) => (
          <Line
            isAnimationActive={false}
            dataKey={currency}
            stroke={COLORS[k % COLORS.length]}
            strokeWidth={2}
            dot={false}
            key={`line-${currency}`}
          />
        ))}

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
