import { Fragment } from "react";
import Stat from "./ref";
import { getDashboardStats } from "@/lib/operation/actions";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function StatsList({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const {
    results: { incomes, expenses, budget },
  } = await getDashboardStats(defaultCurrency);

  return (
    <Fragment>
      <Stat
        title="Przychody"
        currency={defaultCurrency}
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
        currency={defaultCurrency}
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
      <Stat
        title="Budżet"
        currency={defaultCurrency}
        description=""
        stat={budget}
      />
    </Fragment>
  );
}
