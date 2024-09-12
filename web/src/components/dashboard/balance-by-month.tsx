"use client";

import Block from "@/components/ui/block";
import LineChart from "@/components/ui/charts/line-chart";
import LineChartLoader from "@/components/ui/charts/line-loader";
import Empty from "@/components/ui/empty";
import { useBalanceHistory } from "@/lib/operations/queries";
import { useState } from "react";
import MonthInput from "../ui/inputs/month";
import YearInput from "../ui/inputs/year";
import getDisabledMonths from "@/utils/operations/get-disabled-months";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../ui/charts/tooltip";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";

const now = new Date();

export default function BalanceByMonth({
  preferences,
}: {
  preferences: Preferences;
}) {
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [currency, setCurrency] = useState<string>(preferences.currency);
  const { width, tickFormatter } = useYAxisWidth(currency);
  const { data: results, isLoading } = useBalanceHistory({
    month: month + 1,
    year,
    currency,
  });

  return (
    <Block
      className="xl:col-span-3 flex-1"
      title="Bilans"
      cta={
        <div className="grid grid-cols-[80px_1fr_112px] gap-2 flex-1 max-w-sm">
          <UniversalSelect
            name="currency"
            size="sm"
            radius="md"
            aria-label="Waluta"
            defaultSelectedKeys={[currency]}
            elements={CURRENCIES}
            onChange={(e) => setCurrency(e.target.value)}
          />
          <MonthInput
            value={month}
            disabledKeys={
              year === now.getFullYear()
                ? getDisabledMonths(now.getMonth())
                : []
            }
            onChange={(value) => setMonth(value)}
          />
          <YearInput value={year} onChange={(value) => setYear(value)} />
        </div>
      }
    >
      {isLoading ? (
        <LineChartLoader className="!p-0" hideTitle />
      ) : results && results.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={results}>
            <CartesianGrid vertical={false} opacity={0.5} />
            <YAxis
              width={width}
              tick={{ fontSize: 12 }}
              dataKey="total_amount"
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
                return new Intl.DateTimeFormat(preferences.language.code, {
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
              cursor={{ fill: "#177981", fillOpacity: 0.1 }}
              isAnimationActive={false}
              labelFormatter={(label) => label}
              content={(props) => (
                <ChartTooltip
                  {...props}
                  payloadName="Wydatki"
                  currency={preferences?.currency}
                  label={undefined}
                  labelFormatter={(label) =>
                    new Intl.DateTimeFormat(preferences?.language.code, {
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
