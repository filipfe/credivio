import { getStocks } from "@/lib/stocks/actions";
import Block from "../ui/block";
import StockTable from "./table";

export default async function StocksByIndex({ title, name }: StocksIndex) {
  const { results: stocks } = await getStocks(name);
  return (
    <Block title={title} className="col-span-3">
      <StockTable stocks={stocks} />
    </Block>
  );
}
