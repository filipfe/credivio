import numberFormat from "@/utils/formatters/currency";
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
  currency,
}: TooltipProps<ValueType, NameType> & {
  payloadName?: string;
  currency: string;
}) {
  if (!active || !payload || payload.length === 0) return;
  const value = payload[0].value ? parseFloat(payload[0].value.toString()) : 0;

  const name = label || payload[0].payload.name;

  return (
    <div
      className={`rounded-md bg-white text-font border-font/10 border min-w-44 shadow-lg shadow-font/5`}
    >
      <div className="py-2 px-4 border-b border-font/10">
        <p className="text-sm">
          {labelFormatter ? labelFormatter(name, payload) : name}
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
        <strong className="font-medium text-sm">
          {numberFormat(currency, value)}
        </strong>
      </div>
    </div>
  );
}
