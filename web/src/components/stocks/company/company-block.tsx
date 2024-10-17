"use client";

import SmallChart from "./small-chart";
import Link from "next/link";
import { usePriceHistory } from "@/lib/stocks/queries";
import NumberFormat from "@/utils/formatters/currency";

export default function CompanyBlock({
  _symbol,
  _symbol_short,
  _change,
  _quote,
}: Stock) {
  const { data } = usePriceHistory(_symbol_short);

  const quote = parseFloat(_quote);
  const isUp =
    _change?.toString().startsWith("+") &&
    !_change?.toString().endsWith("0.00");
  const isDown = _change?.toString().startsWith("-");

  return (
    <Link
      href={`/stocks/${_symbol}`}
      className="flex-1 bg-white border p-6 gap-4 sm:gap-8 flex items-center justify-between rounded-md"
    >
      <div>
        <h3 className="font-medium text-sm">{_symbol_short}</h3>
        <p className="text-tiny text-font/80">{_symbol}</p>
      </div>
      <div
        className={`flex items-center gap-4 ${
          isUp ? "text-success" : isDown ? "text-danger" : "text-font/70"
        }`}
      >
        <SmallChart quotes={data || []} isDown={isDown} isUp={isUp} />
        <span className="text-sm font-medium">
          <NumberFormat currency="PLN" amount={quote} />
        </span>
        <div
          className={`flex items-center gap-2 rounded px-1.5 py-1 ${
            isUp
              ? "text-success bg-success/10"
              : isDown
              ? "text-danger bg-danger/10"
              : "text-font/70 bg-font/5"
          }`}
        >
          <span className="font-medium text-tiny">{_change}%</span>
        </div>
      </div>
    </Link>
  );
}
