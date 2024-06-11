import OperationRef from "@/components/operations/ref";
import Block from "@/components/ui/block";
import HorizontalScroll from "@/components/ui/horizontal-scroll";

const paymentsTest2: RecurringPayment[] = [
  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "PLN",
    type: "income",
  },
  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "PLN",
    type: "expense",
  },
  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "USD",
    type: "expense",
  },

  {
    id: "febc139d-0e67-405d-8213-3f47088b13bf",
    next_payment_date: "2024-03-22",
    interval_days: 7,
    title: "test",
    amount: 10,
    currency: "EUR",
    type: "expense",
  },
];

export default function ComingUp({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) return;
  return (
    <Block title="Nadchodzące">
      <HorizontalScroll>
        {payments.map((payment) => (
          <OperationRef {...payment} key={payment.id} />
        ))}
      </HorizontalScroll>
    </Block>
  );
}
