import { getSpecificStocks } from "@/lib/stocks/actions";
import Block from "../ui/block";
import { ScrollShadow } from "@nextui-org/react";
import StockTable from "./table";
import { Fragment } from "react";
import HorizontalScroll from "../ui/horizontal-scroll";
import CompanyBlock from "./company/company-block";

export default async function OwnStocks({ holdings }: { holdings: Holdings }) {
  const stocksNames: string[] = Object.keys(holdings);
  const { results: stocks } = await getSpecificStocks(stocksNames);

  return (
    <Fragment>
      {stocks.length > 0 && (
        <HorizontalScroll fullWidth className="col-span-full">
          {stocks.map((item, k) => (
            <CompanyBlock {...item} key={`company-block:${k}`} />
          ))}
        </HorizontalScroll>
      )}
      <Block title="Moje instrumenty" className="col-span-2 w-screen sm:w-auto">
        <ScrollShadow className="w-full" hideScrollBar orientation="horizontal">
          <StockTable
            quantityVisible
            simplified
            stocks={stocks.map((item) => ({
              ...item,
              quantity: holdings[item._symbol],
            }))}
          />
        </ScrollShadow>
      </Block>
    </Fragment>
  );
}
