import BigChart from "@/components/stocks/company/big-chart";
import Block from "@/components/ui/block";
import { getPricePeriod, getSpecificStocks } from "@/lib/stocks/actions";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { symbol: string } }) {
  const { results: stocks } = await getSpecificStocks([params.symbol]);

  if (stocks.length === 0) redirect("/stocks");
  const { _symbol_short, _symbol, _quote, _change } = stocks[0];

  const { results } = await getPricePeriod(_symbol_short);
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
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-6 lg:grid grid-cols-2">
      <Block>
        <div className="mb-8 flex flex-col gap-2">
          <h3 className="text-font/80">Cena</h3>
          <strong className="font-semibold text-2xl">{price}</strong>
        </div>
        {/* <BigChart quotes={results} isUp={isUp} isDown={isDown} /> */}
      </Block>
      <Block title={_symbol}>
        <></>
      </Block>
    </div>
  );
}
