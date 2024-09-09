"use client";

import numberFormat from "@/utils/formatters/currency";
import {
  ResponsiveContainer,
  BarChart as BarChartWrapper,
  Bar,
  CartesianGrid,
  YAxis,
  XAxis,
  Cell,
  Tooltip,
} from "recharts";
import ChartTooltip from "./tooltip";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { useMemo } from "react";
import { COLORS } from "@/const";

type Props = {
  data: ChartLabel[];
  currency: string;
};

export default function BarChart({ data, currency }: Props) {
  const { width, tickFormatter } = useYAxisWidth(currency);

  const dataWithColors = useMemo(
    () =>
      data.map((item, k) => ({
        ...item,
        color: COLORS[k % COLORS.length],
      })),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartWrapper
        data={data}
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
        <Bar maxBarSize={120} dataKey="total_amount" radius={[24, 24, 0, 0]}>
          {dataWithColors.map((item) => (
            <Cell
              className="transition-opacity opacity-100 hover:opacity-80"
              fill={item.color}
              key={item.name}
            />
          ))}
        </Bar>
        <Tooltip
          isAnimationActive={false}
          shared={false}
          labelFormatter={(label) => label}
          content={(props) => {
            return (
              <ChartTooltip
                {...props}
                payload={
                  props.payload
                    ? props.payload.map((record) => ({
                        ...record,
                        color: dataWithColors.find(
                          (item) => item.name === record.payload.name
                        )?.color,
                      }))
                    : []
                }
                payloadName="Wydatki"
                currency={currency}
                label={undefined}
              />
            );
          }}
        />
      </BarChartWrapper>
    </ResponsiveContainer>
  );
}
