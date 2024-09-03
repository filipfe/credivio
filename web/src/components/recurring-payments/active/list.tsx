import Block from "@/components/ui/block";
import { getRecurringPayments } from "@/lib/recurring-payments/actions";
import Empty from "@/components/ui/empty";
import Table from "./table";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";

export default async function ActiveRecurringPaymentsList() {
  const { results: payments } = await getRecurringPayments();

  return (
    <Block title="Aktywne" cta={cta}>
      {payments.length > 0 ? (
        // <div className="flex flex-col gap-4 justify-center">
        //   {payments.map((payment) => (
        //     <ActiveRecurringPayment {...payment} key={payment.id} />
        //   ))}
        // </div>

        <Table payments={payments} />
      ) : (
        <Empty
          title="Nie masz aktywnych płatności cyklicznych!"
          cta={{ title: "Dodaj płatność", href: "/recurring-payments/add" }}
        />
      )}
    </Block>
  );
}

const cta = (
  <Link href="/recurring-payments/add">
    <Button
      as="div"
      variant="light"
      disableRipple
      startContent={<Plus size={14} />}
      className="h-8 bg-light border"
      size="sm"
      radius="md"
    >
      Dodaj
    </Button>
  </Link>
);
