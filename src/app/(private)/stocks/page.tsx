import Dividends from "@/components/stocks/dividends/block";
import { Fragment, Suspense } from "react";
import StocksByIndex from "@/components/stocks/stocks-by-index";
import Loader from "@/components/stocks/loader";
import StocksAndTransactions from "@/components/stocks/stocks-transactions";

const STOCK_INDEXES: StocksIndex[] = [
  {
    name: "wig20",
    title: "WIG20",
  },
  {
    name: "mwig40",
    title: "mWIG40",
  },
];

export default function Page() {
  return (
    <div className="sm:px-12 pt-4 sm:pt-8 pb-24 flex flex-col h-full">
      <div className="flex flex-col xl:grid grid-cols-6 gap-4 sm:gap-8">
        <Suspense
          fallback={
            <Fragment>
              <Loader className="col-span-2" />
              <Loader className="col-span-2" />
            </Fragment>
          }
        >
          <StocksAndTransactions />
        </Suspense>
        <Suspense fallback={<Loader className="col-span-2" />}>
          <Dividends />
        </Suspense>
        {STOCK_INDEXES.map((index) => (
          <Suspense
            fallback={<Loader className="col-span-3" />}
            key={`suspense:${index.name}`}
          >
            <StocksByIndex {...index} key={index.name} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
