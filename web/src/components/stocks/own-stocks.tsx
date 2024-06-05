import { getSpecificStocks } from "@/lib/stocks/actions";
import Block from "../ui/block";
import Add from "../ui/cta/add";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import { ScrollShadow } from "@nextui-org/react";
import StockTable from "./table";
import { Fragment, Suspense } from "react";
import HorizontalScroll from "../ui/horizontal-scroll";
import CompanyBlock from "./company/company-block";

export default async function OwnStocks({
  transactions,
}: {
  transactions: StockTransaction[];
}) {
  const holdings: Holdings =
    transactions.length > 0 ? getStockHoldings(transactions) : {};
  const stocksNames: string[] = Object.keys(holdings)
    .sort((a, b) => holdings[b] - holdings[a])
    .slice(0, 6);
  const { results: stocks } = await getSpecificStocks(stocksNames);

  return (
    <Fragment>
      {stocks.length > 0 && (
        <HorizontalScroll className="col-span-full">
          {stocks.map((item, k) => (
            <Suspense fallback="Loading" key={`suspense:company-block:${k}`}>
              <CompanyBlock {...item} key={`company-block:${k}`} />
            </Suspense>
          ))}
        </HorizontalScroll>
      )}
      <Block title="Moje instrumenty" className="col-span-2 w-screen sm:w-auto">
        {transactions.length > 0 ? (
          <ScrollShadow
            className="w-full"
            hideScrollBar
            orientation="horizontal"
          >
            <StockTable
              quantityVisible
              simplified
              stocks={stocks.map((item) => ({
                ...item,
                quantity: holdings[item._symbol],
              }))}
            />
          </ScrollShadow>
        ) : (
          <div className="text-center flex-1 justify-center flex flex-col items-center gap-2">
            <p className="text-sm text-font/80">
              Nie masz jeszcze żadnych akcji!
            </p>
            <Add size="sm" type="stocks/transaction" />
          </div>
        )}
      </Block>
    </Fragment>
  );
}
