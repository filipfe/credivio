import { Fragment } from "react";
import Stat from "./ref";
import { getDashboardStats } from "@/lib/operation/actions";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function StatsList() {
  const {
    results: [{ incomes, expenses, budget }],
  } = await getDashboardStats();
  return (
    <Fragment>
      {/* {expenses.length > 0 && (
        <ScrollShadow
          orientation="horizontal"
          hideScrollBar
          className="grid grid-cols-10 gap-6"
        >
          {expenses.map((item, k) => (
            <OperationRef {...item} type={"expense"} key={`op:${k}`} />
          ))}
        </ScrollShadow>
      )} */}
      <Stat
        title="Przychody"
        currency="PLN"
        description=""
        stat={incomes}
        cta={
          <Link href="/incomes/add">
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              as="div"
              className="h-7 min-w-7 w-7"
            >
              <PlusIcon size={16} />
            </Button>
          </Link>
        }
      />
      <Stat
        title="Wydatki"
        currency="PLN"
        description=""
        stat={expenses}
        cta={
          <Link href="/expenses/add">
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              as="div"
              className="h-7 min-w-7 w-7"
            >
              <PlusIcon size={16} />
            </Button>
          </Link>
        }
      />
      <Stat title="Budżet" currency="PLN" description="" stat={budget} />
    </Fragment>
  );
}
