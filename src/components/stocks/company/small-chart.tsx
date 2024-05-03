"use client";

import { Area, AreaChart, YAxis } from "recharts";

type Props = { quotes: number[][]; isUp: boolean; isDown: boolean };

export default function SmallChart({ quotes, isUp, isDown }: Props) {
  const validQuotes = quotes.map((record) => {
    const [time, _open, _high, _low, close, _volume] = record;
    return {
      dateTime: new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(time * 1000),
      price: close,
    };
  });

  const prices = validQuotes.map((product) => product.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  console.log({ isUp, isDown });

  return (
    <AreaChart
      data={validQuotes}
      width={200}
      height={40}
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
      <YAxis domain={[minPrice, maxPrice]} axisLine={false} tick={false} />
      <Area
        type="monotone"
        dataKey="price"
        stroke={isUp ? "#32a852" : isDown ? "#f31212" : "#000"}
        fillOpacity={1}
        fill={isUp ? "url(#color-success)" : isDown ? "url(#color-danger)" : ""}
      />
    </AreaChart>
  );
}
