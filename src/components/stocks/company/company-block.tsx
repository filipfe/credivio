import { getPriceHistory } from "@/lib/stocks/actions";
import SmallChart from "./small-chart";
import Link from "next/link";

export default async function CompanyBlock({
  _symbol,
  _symbol_short,
  _change,
  _quote,
}: Stock) {
  const { results } = await getPriceHistory(_symbol_short);
  const quote = parseFloat(_quote);
  const price = new Intl.NumberFormat("pl-PL", {
    currency: "PLN",
    style: "currency",
  }).format(quote);
  const isUp =
    _change?.toString().startsWith("+") &&
    !_change?.toString().endsWith("0.00");
  const isDown = _change?.toString().startsWith("-");
  return (
    <Link
      href={`/stocks/${_symbol}`}
      className="flex-1 bg-white p-6 gap-8 flex items-center justify-between rounded-md"
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
        <SmallChart quotes={results} isDown={isDown} isUp={isUp} />
        <span className="text-sm font-medium">{price}</span>
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
