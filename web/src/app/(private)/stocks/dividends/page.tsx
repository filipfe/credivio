import DividendsTable from "@/components/stocks/dividends/dividends-table";
import Block from "@/components/ui/block";
import { getOwnRows } from "@/lib/general/actions";
import { getDividendInfo } from "@/lib/stocks/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import groupDividends from "@/utils/stocks/group-dividends";
import sortDividends from "@/utils/stocks/sort-dividends";

export default async function Page() {
  const [{ results: dividends }, { results: ownStocks }] = await Promise.all([
    getDividendInfo(),
    getOwnRows<StockTransaction>("stock"),
  ]);
  const { future, past } = groupDividends(dividends);
  const holdings = getStockHoldings(ownStocks);
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6">
      <Block title="Bieżące">
        <DividendsTable dividends={sortDividends(future)} holdings={holdings} />
      </Block>
      <Block title="Przeszłe">
        <DividendsTable dividends={past} />
      </Block>
    </div>
  );
}
