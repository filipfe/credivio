import { getSpecificStocks } from "@/lib/stocks/actions";
import Block from "../ui/block";
import Add from "../ui/cta/add";
import StockTable from "./table";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";

export default async function OwnStocks({
  stocks,
}: {
  stocks: StockTransaction[];
}) {
  let ownStocks: Stock[] = [];
  let holdings: Holdings = {};
  if (stocks.length > 0) {
    holdings = getStockHoldings(stocks);
    const ownStocksNames: string[] = stocks.reduce(
      (prev, curr) =>
        prev.includes(curr.symbol) ? prev : [...prev, curr.symbol],
      [] as string[]
    );
    ownStocks = (await getSpecificStocks(ownStocksNames)).results;
  }
  ownStocks = ownStocks
    .map((stock) => ({
      ...stock,
      quantity: holdings[stock._symbol],
    }))
    .filter((stock) => stock.quantity > 0)
    .slice(0, 6);

  return (
    <Block title="Moje instrumenty" className="col-span-2">
      {stocks.length > 0 ? (
        <StockTable quantityVisible simplified stocks={ownStocks} />
      ) : (
        <div className="text-center flex-1 justify-center flex flex-col items-center gap-2">
          <p className="text-sm text-font/80">
            Nie masz jeszcze żadnych akcji!
          </p>
          <Add size="sm" type="stocks/transaction" />
        </div>
      )}
    </Block>
  );
}
