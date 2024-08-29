import OperationRef from "@/components/operations/ref";
import Block from "@/components/ui/block";
import Empty from "@/components/ui/empty";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getUpcomingRecurringPayments } from "@/lib/recurring-payments/actions";

export default async function Upcoming() {
  const { results: payments } = await getUpcomingRecurringPayments();

  return (
    <Block title="Nadchodzące">
      {payments.length > 0 ? (
        <HorizontalScroll>
          {payments.map((payment) => (
            <OperationRef
              payment={{ ...payment, issued_at: payment.payment_date }}
              key={payment.id}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <Empty
          title="Brak nadchodzących płatności!"
          cta={{
            title: "Dodaj płatność cykliczną",
            href: "/recurring-payments/add",
          }}
        />
      )}
    </Block>
  );
}
