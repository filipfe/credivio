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
  const { data: result, error } = await supabase.rpc("get_dashboard_stats", {
    p_currency: defaultCurrency,
  });

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
        amount={incomes}
        cta={
          <Link href="/incomes/add">
            <Button
              as="div"
              variant="light"
              disableRipple
              startContent={<PlusIcon size={14} />}
              className="h-8 bg-light border"
              size="sm"
              radius="md"
            >
              Dodaj
            </Button>
          </Link>
        }
      />
      <Stat
        title="Wydatki"
        currency={defaultCurrency}
        description=""
        amount={expenses}
        cta={
          <Link href="/expenses/add">
            <Button
              as="div"
              variant="light"
              disableRipple
              startContent={<PlusIcon size={14} />}
              className="h-8 bg-light border"
              size="sm"
              radius="md"
            >
              Dodaj
            </Button>
          </Link>
        }
      />
      <Stat
        title="Bilans"
        currency={defaultCurrency}
        description=""
        amount={balance}
      />
    </Fragment>
  );
}
