import Block from "@/components/ui/block";
import { Button, ScrollShadow } from "@nextui-org/react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import DividendsTable from "./dividends-table";
import { getDividendInfo } from "@/lib/stocks/actions";
import groupDividends from "@/utils/stocks/group-dividends";
import sortDividends from "@/utils/stocks/sort-dividends";

export default async function Dividends() {
  const { results: dividends } = await getDividendInfo();
  const { future } = groupDividends(dividends);
  const orderedDividends = sortDividends(future).slice(0, 6);
  return (
    <Block
      title="Dywidendy"
      className="col-span-2 w-screen sm:w-auto"
      cta={cta}
    >
      <ScrollShadow hideScrollBar orientation="horizontal">
        <DividendsTable dividends={orderedDividends} simplified />
      </ScrollShadow>
    </Block>
  );
}

const cta = (
  <Link href="/stocks/dividends">
    <Button as="div" size="sm" color="primary" variant="light" className="h-7">
      <span className="mb-px">Więcej</span>
      <ChevronRightIcon size={14} />
    </Button>
  </Link>
);
