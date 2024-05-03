import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export default function ChartTooltip({
  active,
  payload,
  label,
  isWhite,
}: TooltipProps<ValueType, NameType> & { isWhite?: boolean }) {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    notation: "standard",
  });
  if (!active || !payload || payload.length === 0) return;
  const value = payload[0].value
    ? formatter.format(parseFloat(payload[0].value.toString()))
    : "";
  return (
    <div className="bg-white rounded-md">
      <div
        className={`p-4  flex flex-col gap-1 rounded-md ${
          isWhite ? "bg-white text-font" : "text-primary bg-primary/10"
        } border border-primary/20`}
      >
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm">
          Budżet: <strong className="font-medium">{value}</strong>
        </p>
      </div>
    </div>
  );
}
