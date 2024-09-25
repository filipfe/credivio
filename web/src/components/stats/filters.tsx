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
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import { StatsFilterContext } from "@/app/(private)/stats/providers";

const now = new Date();

export default function Filters() {
  const { month, setMonth, year, setYear, currency, setCurrency } =
    useContext(StatsFilterContext);

  return (
    <Block className="xl:col-span-3 flex-1" title="">
      <div className="grid grid-cols-[80px_1fr_112px] gap-2 flex-1 max-w-sm">
        <UniversalSelect
          name="currency"
          size="sm"
          radius="md"
          aria-label="Waluta"
          selectedKeys={[currency]}
          elements={CURRENCIES}
          onChange={(e) => setCurrency(e.target.value)}
        />
        <MonthInput
          value={month}
          disabledKeys={
            year === now.getFullYear() ? getDisabledMonths(now.getMonth()) : []
          }
          onChange={(value) => setMonth(value)}
        />
        <YearInput value={year} onChange={(value) => setYear(value)} />
      </div>
    </Block>
  );
}
