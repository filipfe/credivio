import DividendsTable from "@/components/stocks/dividends/dividends-table";
import Block from "@/components/ui/block";
import { getDividendInfo, getHoldings } from "@/lib/stocks/actions";
import groupDividends from "@/utils/stocks/group-dividends";
import sortDividends from "@/utils/stocks/sort-dividends";

export default async function Page() {
  const [{ results: dividends }, { result: holdings }] = await Promise.all([
    getDividendInfo(),
    getHoldings(),
  ]);
  const { future, past } = groupDividends(dividends);

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
