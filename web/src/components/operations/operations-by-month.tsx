"use client";

import Block from "@/components/ui/block";
import Empty from "@/components/ui/empty";
import { useOperationsAmountsHistory } from "@/lib/operations/queries";
import { useState } from "react";
import UniversalSelect from "../ui/universal-select";
import { CURRENCIES } from "@/const";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartLoader from "../ui/charts/loader";
import useYAxisWidth from "@/hooks/useYAxisWidth";
import ChartTooltip from "../ui/charts/tooltip";
import { Dict } from "@/const/dict";

type Props = {
  type: "income" | "expense";
  settings: Settings;
  title: string;
  dict: Dict["private"]["operations"]["operations-by-month"];
};

export default function OperationsByMonth({
  type,
  settings,
  title,
  dict,
}: Props) {
  const [currency, setCurrency] = useState<string>(settings.currency);
  const { data: results, isLoading } = useOperationsAmountsHistory(
    type,
    settings.timezone,
    {
      currency,
    }
  );
  const { width, tickFormatter } = useYAxisWidth(currency);

  return (
    <Block
      className="xl:col-span-3 flex-1"
      title={title}
      cta={
        <UniversalSelect
          className="w-20"
          name="currency"
          size="sm"
          radius="md"
          aria-label="Waluta"
          isDisabled={isLoading}
          selectedKeys={currency ? [currency] : []}
          elements={CURRENCIES}
          onChange={(e) => setCurrency(e.target.value)}
        />
      }
    >
      {isLoading ? (
        <ChartLoader className="!p-0" hideTitle />
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
            />
            <XAxis
              tickMargin={8}
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(label) => {
                const [year, month, day] = label.split("-");
                return new Intl.DateTimeFormat(settings.language, {
                  day: "2-digit",
                  month: "short",
                  timeZone: settings.timezone,
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
                  payloadName={title}
                  currency={currency}
                  label={undefined}
                  labelFormatter={(label) =>
                    new Intl.DateTimeFormat(settings.language, {
                      dateStyle: "full",
                      timeZone: settings.timezone,
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
          title={dict._empty.title}
          cta={{
            title: dict._empty.button[type],
            href: `/${type}s/add`,
          }}
        />
      )}
    </Block>
  );
}
