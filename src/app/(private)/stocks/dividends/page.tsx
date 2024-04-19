import DividendsTable from "@/components/stocks/dividends/dividends-table";
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
    <div>
      <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12">
        <h2 className="text-lg mb-2">Bieżące</h2>
        <DividendsTable dividends={sortDividends(future)} holdings={holdings} />
      </section>
      <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12">
        <h2 className="text-lg mb-2">Przeszłe</h2>
        <DividendsTable dividends={past} />
      </section>
    </div>
  );
}
