import { Fragment } from "react";
import Stat from "./ref";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function StatsList({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const supabase = createClient();
  const { data: result, error } = await supabase.rpc(
    "get_general_dashboard_stats",
    {
      p_currency: defaultCurrency,
    }
  );

  if (!result) {
    console.error(error?.message);
    throw new Error("Failed to retrieve the data!");
  }

  const { incomes, expenses, balance } = result;

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
        title="Bilans"
        currency={defaultCurrency}
        description=""
        stat={balance}
      />
    </Fragment>
  );
}
