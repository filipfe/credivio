import numberFormat from "@/utils/formatters/currency";
import { TooltipProps } from "recharts";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export default function ChartTooltip({
  active,
  payload,
  label,
  payloadName,
  labelFormatter,
  currency,
}: TooltipProps<ValueType, NameType> & {
  payloadName?: string;
  currency?: string;
}) {
  if (!active || !payload || payload.length === 0) return;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="rounded-md bg-white text-font border-font/10 border min-w-44 shadow-lg shadow-font/5">
          <div className="py-2 px-4">
            <p className="text-sm font-medium">{label}</p>
          </div>
        </div>
      )}
      {payload.map((record, k) => (
        <BoxRef
          {...record}
          label={label}
          labelFormatter={labelFormatter}
          currency={currency}
          payloadName={payloadName}
          key={`tooltip-${record.dataKey}-${k}`}
        />
      ))}
    </div>
  );
}

const BoxRef = ({
  value,
  color,
  payload,
  labelFormatter,
  currency,
  payloadName,
  name,
  label,
}: Payload<ValueType, NameType> & {
  payloadName?: string;
  currency?: string;
  label?: string;
  labelFormatter?: (
    label: any,
    payload: Payload<ValueType, NameType>[]
  ) => React.ReactNode;
}) => {
  const title = payload.date || payload.name || name;
  const amount = value ? parseFloat(value.toString()) : 0;
  return (
    <div className="rounded-md bg-white text-font border-font/10 border min-w-44 shadow-lg shadow-font/5">
      <div className="py-2 px-4 border-b border-font/10">
        <p className="text-sm">
          {labelFormatter ? labelFormatter(title, payload) : title}
        </p>
      </div>
      <div className="py-2 px-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          {color && (
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
              <div
                style={{ backgroundColor: color }}
                className="w-2 h-2 rounded-full"
              />
            </div>
          )}
          <span className="text-sm">{payloadName}</span>
        </div>
        <strong className="font-medium text-sm">
          {numberFormat((currency || title?.toString())!, amount)}
        </strong>
      </div>
    </div>
  );
};
