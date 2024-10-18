import BigChart from "@/components/stocks/company/big-chart";
import Block from "@/components/ui/block";
import { getSettings } from "@/lib/general/actions";
import { getPricePeriod, getSpecificStocks } from "@/lib/stocks/actions";
import NumberFormat from "@/utils/formatters/currency";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { symbol: string } }) {
  const { results: stocks } = await getSpecificStocks([params.symbol]);
  const settings = await getSettings();

  if (stocks.length === 0) redirect("/stocks");
  const {
    _symbol_short,
    _symbol,
    _quote,
    _change,
    _change_pnts,
    _change_suffix,
    _change_type,
    _quote_open,
    _quote_max,
    _quote_min,
    _quote_volume,
  } = stocks[0];
  const { results } = await getPricePeriod(_symbol_short);
  const quote = parseFloat(_quote);
  const isUp =
    _change?.toString().startsWith("+") &&
    !_change?.toString().endsWith("0.00");
  const isDown = _change?.toString().startsWith("-");
  const quotes: PriceRecord[] = results.map((record) => {
    const [time, _open, _high, _low, price, _volume] = record;
    return {
      price,
      time,
    };
  });

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-6 lg:grid grid-cols-[3fr_2fr]">
      <Block>
        <div className="mb-8 flex flex-col gap-1">
          <h3 className="text-font/80 ">
            {_symbol} ({_symbol_short})
          </h3>
          <strong className="text-3xl font-medium">
            <NumberFormat currency="PLN" amount={quote} />
          </strong>
          <div className="flex items-center gap-[1ch]">
            <span
              className={`font-medium ${
                isUp ? "text-success" : isDown ? "text-danger" : "text-font"
              }`}
            >
              {_change}
              {_change_suffix}{" "}
              <NumberFormat currency="PLN" amount={_change_pnts} />
            </span>
            <span>Ostatnie 24 godziny</span>
          </div>
        </div>
        <BigChart
          quotes={quotes}
          isUp={isUp}
          isDown={isDown}
          currency={settings.currency}
        />
      </Block>
      <Block title={_symbol}>
        <></>
      </Block>
    </div>
  );
}
