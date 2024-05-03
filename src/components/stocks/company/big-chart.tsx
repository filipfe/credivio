"use client";

import ChartTooltip from "@/components/ui/charts/tooltip";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  quotes: PriceRecord[];
  isUp: boolean;
  isDown: boolean;
};

export default function BigChart({ quotes, isUp, isDown }: Props) {
  const prices = quotes.map(({ price }) => price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const diff = Math.abs(maxPrice - minPrice);
  return (
    <ResponsiveContainer width="100%" height={360}>
      <AreaChart
        data={quotes.map(({ time, ...rest }) => ({
          ...rest,
          time: new Intl.DateTimeFormat("pl-PL", {
            timeStyle: "short",
          }).format(time * 1000),
        }))}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
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
          tickFormatter={(value) =>
            new Intl.NumberFormat("pl-PL", {
              style: "currency",
              currency: "PLN",
              notation: "standard",
              maximumFractionDigits: 2,
            }).format(value)
          }
          domain={[minPrice - diff, maxPrice + diff]}
          axisLine={false}
        />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<ChartTooltip isWhite />} />
        <CartesianGrid strokeWidth={1} vertical={false} stroke="#e0e0e0" />
        <Area
          type="monotone"
          dataKey="price"
          stroke={isUp ? "#32a852" : isDown ? "#f31212" : "#000"}
          fillOpacity={1}
          fill={
            isUp ? "url(#color-success)" : isDown ? "url(#color-danger)" : ""
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
