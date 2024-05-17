import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export default function ChartTooltip({
  active,
  payload,
  label,
  contentStyle,
  payloadName,
  labelFormatter,
  defaultCurrency,
}: TooltipProps<ValueType, NameType> & {
  payloadName?: string;
  defaultCurrency: string;
}) {
  const currencyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: defaultCurrency,
    notation: "standard",
  });
  if (!active || !payload || payload.length === 0) return;
  const value = payload[0].value
    ? currencyFormatter.format(parseFloat(payload[0].value.toString()))
    : "";
  return (
    <div
      className={`rounded-md bg-white text-font border-font/10 border min-w-44 shadow-lg shadow-font/5`}
    >
      <div className="py-2 px-4 border-b border-font/10">
        <p className="text-sm">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </p>
      </div>
      <div className="py-2 px-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
            <div
              style={{ backgroundColor: contentStyle?.backgroundColor }}
              className="w-2 h-2 rounded-full"
            />
          </div>
          <span className="text-sm">{payloadName}</span>
        </div>
        <strong className="font-medium text-sm">{value}</strong>
      </div>
    </div>
  );
}
