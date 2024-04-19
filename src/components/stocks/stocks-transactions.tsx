import { getOwnRows } from "@/lib/general/actions";
import { Fragment, Suspense } from "react";
import StockTable from "./table";
import TransactionTable from "./transactions-table";
import Add from "../ui/cta/add";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import Block from "../ui/block";
import Loader from "./loader";
import OwnStocks from "./own-stocks";

export default async function StocksAndTransactions() {
  const { results: stocks, count } = await getOwnRows<StockTransaction>(
    "stock"
  );

  return (
    <Fragment>
      <Suspense fallback={<Loader className="col-span-2" />}>
        <OwnStocks stocks={stocks} />
      </Suspense>
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
        {stocks.length > 0 ? (
          <TransactionTable
            title={"Ostatnie transakcje"}
            count={count || 0}
            rows={stocks.slice(0, 6)}
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
    </Fragment>
  );
}
