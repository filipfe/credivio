import Add from "@/components/ui/cta/add";
import DividendsTable from "@/components/stocks/dividends-table";
import StockTable from "@/components/stocks/table";
import TransactionTable from "@/components/stocks/transactions-table";
import Block from "@/components/ui/block";
import {
  getDividendInfo,
  getSpecificStocks,
  getStocks,
} from "@/lib/stocks/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";
import groupDividends from "@/utils/stocks/group-dividends";
import sortDividends from "@/utils/stocks/sort-dividends";
import { Button } from "@nextui-org/react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { getOwnRows } from "@/lib/general/actions";

export default async function Page() {
  const [
    { results: wig20 },
    { results: mwig40 },
    { results: ownStocks, count },
    { results: dividends },
  ] = await Promise.all([
    getStocks("wig20"),
    getStocks("mwig40"),
    getOwnRows<StockTransaction>("stock"),
    getDividendInfo(),
  ]);
  const { future } = groupDividends(dividends);
  let ownStocksList: Stock[] = [];
  let holdings: Holdings = {};
  if (ownStocks.length > 0) {
    const ownStocksNames: string[] = ownStocks.reduce(
      (prev, curr) =>
        prev.includes(curr.symbol) ? prev : [...prev, curr.symbol],
      [] as string[]
    );
    ownStocksList = (await getSpecificStocks(ownStocksNames)).results;
    holdings = getStockHoldings(ownStocks);
  }
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <div className="flex flex-col xl:grid grid-cols-6 gap-8">
        <Block title="Moje instrumenty" className="col-span-2">
          {ownStocks.length > 0 ? (
            <StockTable
              quantityVisible
              simplified
              stocks={ownStocksList
                .map((stock) => ({
                  ...stock,
                  quantity: holdings[stock._symbol],
                }))
                .filter((stock) => stock.quantity > 0)
                .slice(0, 6)}
            />
          ) : (
            <div className="text-center flex-1 justify-center flex flex-col items-center gap-2">
              <p className="text-sm text-font/80">
                Nie masz jeszcze żadnych akcji!
              </p>
              <Add size="sm" type="stocks/transaction" />
            </div>
          )}
        </Block>
        <Block
          title="Moje transakcje"
          className="col-span-2"
          cta={
            <Link href="/stocks/transactions">
              <Button
                as="div"
                size="sm"
                color="primary"
                variant="light"
                className="h-7"
              >
                <span className="mb-px">Więcej</span>
                <ChevronRightIcon size={14} />
              </Button>
            </Link>
          }
        >
          {ownStocks.length > 0 ? (
            <TransactionTable
              title={"Ostatnie transakcje"}
              count={count || 0}
              rows={ownStocks.slice(0, 6)}
              simplified
            />
          ) : (
            <div className="text-center flex-1 justify-center flex flex-col items-center gap-3">
              <p className="text-sm text-font/80">
                Nie masz jeszcze żadnych transakcji!
              </p>
              <Add size="sm" type="stocks/transaction" />
            </div>
          )}
        </Block>
        <Block
          title="Dywidendy"
          className="col-span-2"
          cta={
            <Link href="/stocks/dividends">
              <Button
                as="div"
                size="sm"
                color="primary"
                variant="light"
                className="h-7"
              >
                <span className="mb-px">Więcej</span>
                <ChevronRightIcon size={14} />
              </Button>
            </Link>
          }
        >
          <DividendsTable
            dividends={sortDividends(future).slice(0, 6)}
            simplified
          />
        </Block>
        <Block title="WIG20" className="col-span-3">
          <StockTable stocks={wig20} />
        </Block>
        <Block title="mWIG40" className="col-span-3">
          <StockTable stocks={mwig40} />
        </Block>
      </div>
    </div>
  );
}
