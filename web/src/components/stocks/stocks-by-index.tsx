import { getStocks } from "@/lib/stocks/actions";
import Block from "../ui/block";
import StockTable from "./table";
import { ScrollShadow } from "@nextui-org/react";

export default async function StocksByIndex({ title, name }: StocksIndex) {
  const { results: stocks } = await getStocks(name);
  return (
    <Block title={title} className="col-span-3 w-screen sm:w-auto">
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <StockTable stocks={stocks} />
      </ScrollShadow>
    </Block>
  );
}
