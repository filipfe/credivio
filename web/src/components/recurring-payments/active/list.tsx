import Block from "@/components/ui/block";
import { getRecurringPayments } from "@/lib/recurring-payments/actions";
import ActiveRecurringPayment from "./ref";
import Empty from "@/components/ui/empty";

export default async function ActiveRecurringPaymentsList() {
  const { results: payments } = await getRecurringPayments();
  return (
    <Block title="Aktywne">
      {payments.length > 0 ? (
        <div className="flex flex-col gap-4 justify-center">
          {payments.map((payment) => (
            <ActiveRecurringPayment {...payment} key={payment.id} />
          ))}
        </div>
      ) : (
        <Empty
          title="Nie masz aktywnych płatności cyklicznych!"
          cta={{ title: "Dodaj płatność", href: "/recurring-payments/add" }}
        />
      )}
    </Block>
  );
}
