import DividendsTable from "@/components/stocks/dividends-table";
import { getDividendInfo, getOwnStocks } from "@/lib/stocks/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";

export default async function Page() {
  const { results: dividends } = await getDividendInfo();
  const { results: ownStocks } = await getOwnStocks();
  const date = new Date();
  const { future, past } = dividends.reduce(
    (prev, curr) => {
      const past = { ...prev, past: [...prev.past, curr] };
      if (!curr.date) return past;
      const [day, month, year] = curr.date.split(".");
      const dividendDate = new Date(`${year}-${month}-${day}`);
      return dividendDate.getTime() >= date.getTime()
        ? { ...prev, future: [...prev.future, curr] }
        : past;
    },
    { future: [] as Dividend[], past: [] as Dividend[] }
  );
  const holdings = getStockHoldings(ownStocks);
  return (
    <div>
      <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12">
        <h2 className="text-lg mb-2">Aktualne</h2>
        <DividendsTable dividends={future} holdings={holdings} />
      </section>
      <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col mt-8 mx-12">
        <h2 className="text-lg mb-2">Przeszłe</h2>
        <DividendsTable dividends={past} />
      </section>
    </div>
  );
}
