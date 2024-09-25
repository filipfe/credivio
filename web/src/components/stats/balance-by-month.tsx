"use client";

import Block from "@/components/ui/block";
import LineChart from "@/components/ui/charts/line-chart";
import LineChartLoader from "@/components/ui/charts/line-loader";
import Empty from "@/components/ui/empty";
import { useBalanceHistory } from "@/lib/operations/queries";
import { useContext, useState } from "react";
import MonthInput from "../ui/inputs/month";
import YearInput from "../ui/inputs/year";
import getDisabledMonths from "@/utils/operations/get-disabled-months";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../ui/charts/tooltip";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { StatsFilterContext } from "@/app/(private)/stats/providers";

export default function BalanceByMonth({
  languageCode,
}: {
  languageCode: string;
}) {
  const { month, year, currency } = useContext(StatsFilterContext);
  const { width, tickFormatter } = useYAxisWidth(currency);

  const { data: results, isLoading } = useBalanceHistory({
    month: month + 1,
    year,
    currency,
  });

  const maxValue = results
    ? Math.max(...results.map((item) => Math.abs(item.total_amount)))
    : 0;

  const buffer = Math.ceil(maxValue * 0.1);
  const yAxisMaxValue = maxValue + buffer;

  const ticks = [
    -yAxisMaxValue,
    -yAxisMaxValue / 2,
    0,
    yAxisMaxValue / 2,
    yAxisMaxValue,
  ];

  return (
    <Block
      className="xl:col-span-3 flex-1 max-h-[500px]"
      title="Bilans operacji"
    >
      {isLoading ? (
        <LineChartLoader className="!p-0" hideTitle />
      ) : results && results.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={240}>
          <BarChart data={results}>
            <CartesianGrid vertical={false} opacity={0.5} />
            <YAxis
              width={width}
              tick={{ fontSize: 12 }}
              dataKey="total_amount"
              axisLine={false}
              tickLine={false}
              tickFormatter={tickFormatter}
              domain={[-yAxisMaxValue, yAxisMaxValue]}
              ticks={ticks}
            />
            <XAxis
              tickMargin={8}
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(label) => {
                const [year, month, day] = label.split("-");
                return new Intl.DateTimeFormat(languageCode, {
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
            <ReferenceLine y={0} stroke="#177981" />
            <Tooltip
              cursor={{ fill: "#177981", fillOpacity: 0.1 }}
              isAnimationActive={false}
              labelFormatter={(label) => label}
              content={(props) => (
                <ChartTooltip
                  {...props}
                  payloadName="Bilans"
                  currency={currency}
                  label={undefined}
                  labelFormatter={(label) =>
                    new Intl.DateTimeFormat(languageCode, {
                      dateStyle: "full",
                    }).format(new Date(label))
                  }
                />
              )}
            />
            <Bar dataKey="total_amount" fill="#177981" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Empty
          title="Brak danych do wyświetlenia!"
          cta={{ title: "Dodaj wydatek", href: "/expenses/add" }}
        />
      )}
    </Block>
  );
}
