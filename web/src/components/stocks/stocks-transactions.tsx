import { Fragment, Suspense } from "react";
// import TransactionTable from "./transactions-table";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import Loader from "./loader";
import OwnStocks from "./own-stocks";
import { getHoldings, getOwnStocks } from "@/lib/stocks/actions";

export default async function StocksAndTransactions() {
  const [{ result: holdings }, { results: transactions, count }] =
    await Promise.all([getHoldings(6), getOwnStocks(undefined, 6)]);

  return (
    <Fragment>
      <Suspense fallback={<Loader className="col-span-2" />}>
        <OwnStocks holdings={holdings || {}} />
      </Suspense>
      <div className="col-span-2 flex items-stretch">
        {/* <TransactionTable
          type="stock"
          title="Ostatnie transakcje"
          count={count || 0}
          rows={transactions || []}
          simplified
          topContent={cta}
        /> */}
      </div>
    </Fragment>
  );
}

const cta = (
  <Link href="/stocks/transactions">
    <Button
      as="div"
      size="sm"
      color="primary"
      variant="light"
      className="h-7 bg-white data-[hover=true]:bg-primary/10 transition-colors"
    >
      <span className="mb-px">Więcej</span>
      <ChevronRightIcon size={14} />
    </Button>
  </Link>
);
