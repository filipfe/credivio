import RecurringPaymentRef from "@/components/recurring-payments/ref";
import Timeline from "@/components/recurring-payments/timeline";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getRecurringPayments } from "@/lib/recurring_payments/actions";
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

const paymentsTest2 = [
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

function getRandomTime() {
  const timeSpans = ["week", "month", "4 days", "2 weeks", "quarter", "year"];
  const randomIndex = Math.floor(Math.random() * timeSpans.length);
  return timeSpans[randomIndex];
}

export default async function Page() {
  const { results: payments } = await getRecurringPayments();

  return (
    <div className="px-10 pt-8 pb-24 flex flex-col h-full gap-8">
      {/* nadchodzace */}
      <HorizontalScroll>
        {payments.map((item) => (
          <RecurringPaymentRef {...item} key={item.id} />
        ))}
      </HorizontalScroll>
      <div className="grid grid-cols-2 gap-10">
        <div className="bg-white sm:rounded-md py-8 px-10">
          {/* przeszle */}
          <h2 className="sm:text-lg">Oś czasu</h2>
          <div className="flex flex-col">
            {Object.keys(paymentsTest).map((month) => (
              <Timeline
                key={month}
                month={month}
                payments={paymentsTest[month]}
              />
            ))}
          </div>
        </div>
        <div className="bg-white sm:rounded-md py-8 px-10">
          <div className="flex flex-col gap-6 w-full">
            <h2 className="sm:text-lg">Aktywne</h2>
            <div className="flex flex-col gap-2 justify-center">
              {paymentsTest2.map((payment) => (
                <div>
                  <div
                    key={payment.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <h3 className="text-lg line-clamp-1">{payment.title}</h3>
                      <small className="text-neutral-500">
                        Last payment:{" "}
                        {new Date(
                          payment.next_payment_date
                        ).toLocaleDateString()}
                        {" | Next payment: "}
                        {new Date(
                          payment.next_payment_date
                        ).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className={`${
                          payment.type === "income"
                            ? "bg-success-light text-success"
                            : "bg-danger-light text-danger"
                        } rounded-full px-1 py-0.5 font-bold text-center`}
                      >
                        {(payment.type === "income" ? "+" : "-") +
                          numberFormat(payment.currency, payment.amount)}
                      </div>
                      <span className="text-lg">/ {getRandomTime()}</span>
                    </div>
                    <Button isIconOnly>
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
