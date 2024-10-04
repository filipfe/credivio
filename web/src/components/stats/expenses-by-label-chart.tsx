"use client";

import Block from "@/components/ui/block";
import ChartLoader from "@/components/ui/charts/loader";
import Empty from "@/components/ui/empty";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { useContext } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../ui/charts/tooltip";
import { StatsFilterContext } from "@/app/(private)/stats/providers";
import { useExpensesByLabel } from "@/lib/general/queries";

const colors = ["#177981", "#fdbb2d", "#448dc9", "#fb923c"];

export default function ExpensesByLabelChart() {
  const { month, year, currency } = useContext(StatsFilterContext);
  const { width, tickFormatter } = useYAxisWidth(currency);
  const { isLoading, data: results } = useExpensesByLabel(
    currency,
    month + 1,
    year
  );

  return (
    <Block
      className="xl:col-span-3 max-h-[500px]"
      title="Wydatki według etykiet"
    >
      <div className="h-96 flex flex-col">
        {isLoading ? (
          <ChartLoader className="!p-0" hideTitle />
        ) : results && results.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={results}
              margin={{ top: 16, left: 8, right: 36, bottom: 0 }}
            >
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
                dataKey="name"
                tick={{
                  fontSize: 14,
                }}
                tickSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Bar
                maxBarSize={120}
                dataKey="total_amount"
                radius={[24, 24, 0, 0]}
              >
                {results.map((item, k) => (
                  <Cell
                    className="transition-opacity opacity-100 hover:opacity-80"
                    fill={colors[k]}
                    key={item.name}
                  />
                ))}
              </Bar>
              <Tooltip
                isAnimationActive={false}
                shared={false}
                content={(props) => (
                  <ChartTooltip
                    {...props}
                    payloadName="Wydatki"
                    currency={currency}
                    label={undefined}
                  />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty title="Brak wydatków z etykietą!" />
        )}
      </div>
    </Block>
  );
}
