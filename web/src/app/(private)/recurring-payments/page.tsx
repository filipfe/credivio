import ActiveRecurringPayment from "@/components/recurring-payments/active-ref";
import RecurringPaymentRef from "@/components/recurring-payments/ref";
import Timeline from "@/components/recurring-payments/timeline";
import Block from "@/components/ui/block";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getRecurringPayments } from "@/lib/recurring-payments/actions";
import numberFormat from "@/utils/formatters/currency";
import { Button, Divider } from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import { Trash2Icon } from "lucide-react";
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

export default async function Page() {
  const { results: payments } = await getRecurringPayments();

  return (
    <div className="px-10 pt-8 pb-24 flex flex-col h-full gap-6">
      {/* nadchodzace */}
      {payments.length > 0 && (
        <HorizontalScroll>
          {payments.map((payment) => (
            <RecurringPaymentRef key={payment.id} payment={payment} />
          ))}
        </HorizontalScroll>
      )}
      <div className="grid grid-cols-2 gap-6">
        <Block title="Oś czasu">
          {/* przeszle */}
          <div className="flex flex-col">
            {Object.keys(paymentsTest).map((month) => (
              <Timeline
                key={month}
                month={month}
                payments={paymentsTest[month]}
              />
            ))}
          </div>
        </Block>
        <Block title="Aktywne">
          <div className="flex flex-col gap-4 justify-center">
            {paymentsTest2.map((payment) => (
              <ActiveRecurringPayment {...payment} key={payment.id} />
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}
