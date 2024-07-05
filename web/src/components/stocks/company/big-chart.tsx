"use client";

import ChartTooltip from "@/components/ui/charts/tooltip";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  quotes: PriceRecord[];
  isUp: boolean;
  isDown: boolean;
  currency: string;
};

const numberFormat = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  notation: "standard",
  maximumFractionDigits: 2,
});

export default function BigChart({ quotes, isUp, isDown, currency }: Props) {
  const { width, tickFormatter } = useYAxisWidth(currency, (value) =>
    numberFormat.format(value)
  );
  const [activeTime, setActiveTime] = useState<number | null>(null);
  const prices = quotes.map(({ price }) => price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const diff = Math.abs(maxPrice - minPrice);
  const color = isUp ? "#32a852" : isDown ? "#f31212" : "#000";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={quotes}
        margin={{ top: 0, right: 0, bottom: 0, left: -10 }}
        // onClick={({ activeLabel, ...rest }) => {
        //   // @ts-ignore
        //   setActiveTime(activeLabel || null);
        // }}
        onMouseDown={({ activeLabel }) => {}}
        onMouseUp={({ activeLabel }) => {}}
      >
        <defs>
          <linearGradient id="color-success" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#32a852" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#32a852" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="color-danger" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f31212" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#f31212" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="color-neutral" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#000000" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={tickFormatter}
          width={width + 16}
          // domain={[minPrice - diff, maxPrice + diff]}
          axisLine={false}
        />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12 }}
          minTickGap={10}
          tickLine={false}
          axisLine={false}
          repeatCount={0}
          tickFormatter={(value) =>
            new Intl.DateTimeFormat("pl-PL", {
              month: "2-digit",
              day: "2-digit",
            }).format(value * 1000)
          }
        />
        <Tooltip
          isAnimationActive={false}
          labelFormatter={(label) =>
            new Intl.DateTimeFormat("pl-PL", {
              weekday: "long",
              month: "long",
              day: "2-digit",
              // hour: "numeric",
              // minute: "numeric",
            }).format(label * 1000)
          }
          contentStyle={{ backgroundColor: color }}
          content={(props) => (
            <ChartTooltip {...props} payloadName="Cena" currency={currency} />
          )}
        />
        <CartesianGrid strokeWidth={1} vertical={false} stroke="#e0e0e0" />
        {activeTime && <ReferenceLine x={activeTime} stroke={color} />}
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          fillOpacity={1}
          fill={
            isUp ? "url(#color-success)" : isDown ? "url(#color-danger)" : ""
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
