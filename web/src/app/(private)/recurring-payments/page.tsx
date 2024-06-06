import ActiveRecurringPaymentsList from "@/components/recurring-payments/active/list";
import Timeline from "@/components/recurring-payments/timeline";
import Loader from "@/components/stocks/loader";
import Block from "@/components/ui/block";
import { ScrollShadow } from "@nextui-org/react";
import { Suspense } from "react";

type PaymentsByMonth = {
  [key: string]: RecurringPayment[];
};

const paymentsTest: PaymentsByMonth = {
  Maj: [
    {
      id: "febc139d-0e67-405d-8213-3f47088b13bf",
      next_payment_date: "2024-05-21",
      interval_days: 7,
      title: "test",
      amount: 10,
      currency: "PLN",
      type: "expense",
    },
    {
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-05-12",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
  Kwiecień: [
    {
      id: "febc139d-0e67-405d-8213-3f47088b13bf",
      next_payment_date: "2024-04-22",
      interval_days: 7,
      title: "test",
      amount: 10,
      currency: "PLN",
      type: "expense",
    },
    {
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-04-21",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
  Marzec: [
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
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-03-21",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
  Luty: [
    {
      id: "febc139d-0e67-405d-8213-3f47088b13bf",
      next_payment_date: "2024-02-22",
      interval_days: 7,
      title: "test",
      amount: 10,
      currency: "PLN",
      type: "expense",
    },
    {
      id: "dbe675c2-839b-4281-bd86-d6e0ab584cc0",
      next_payment_date: "2024-02-21",
      interval_days: 7,
      title: "testusd",
      amount: 15,
      currency: "USD",
      type: "income",
    },
  ],
};

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

export default function Page() {
  return (
    <div className="px-10 py-4 sm:py-8 flex flex-col h-full max-h-[calc(100*var(--vh)-80px)] gap-6">
      {/* nadchodzace */}
      {/* {payments.length > 0 && (
        <HorizontalScroll>
          {payments.map((payment) => (
            <RecurringPaymentRef key={payment.id} payment={payment} />
          ))}
        </HorizontalScroll>
      )} */}
      <div className="grid grid-cols-2 gap-6">
        <Block title="Oś czasu">
          {/* przeszle */}
          <ScrollShadow
            className="max-h-[calc(100*var(--vh)-260px)]"
            hideScrollBar
          >
            <div className="flex flex-col">
              {Object.keys(paymentsTest).map((month) => (
                <Timeline
                  key={month}
                  month={month}
                  payments={paymentsTest[month]}
                />
              ))}
            </div>
          </ScrollShadow>
        </Block>
        <Suspense fallback={<Loader />}>
          <ActiveRecurringPaymentsList />
        </Suspense>
      </div>
    </div>
  );
}
