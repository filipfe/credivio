import { getSpecificStocks } from "@/lib/stocks/actions";
import Block from "../ui/block";
import { ScrollShadow } from "@nextui-org/react";
import StockTable from "./table";
import { Fragment } from "react";
import HorizontalScroll from "../ui/horizontal-scroll";
import CompanyBlock from "./company/company-block";
import Empty from "../ui/empty";

export default async function OwnStocks({ holdings }: { holdings: Holdings }) {
  // if (!holdings) {
  //   return (
  //     <Block title="Moje instrumenty" className="col-span-2 w-screen sm:w-auto">
  //       <Empty
  //         title="Nie masz jeszcze żadnych akcji!"
  //         cta={{
  //           title: "Dodaj transkację",
  //           href: "/stocks/transactions/add",
  //         }}
  //       />
  //     </Block>
  //   );
  // }

  const stocksNames: string[] = Object.keys(holdings);
  const { results: stocks } = await getSpecificStocks(stocksNames);

  if (stocks.length === 0) return <></>;

  return (
    <Fragment>
      <HorizontalScroll fullWidth className="col-span-full">
        {stocks.map((item, k) => (
          <CompanyBlock {...item} key={`company-block:${k}`} />
        ))}
      </HorizontalScroll>
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
