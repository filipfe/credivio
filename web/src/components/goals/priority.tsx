"use client";

import { Progress, ScrollShadow } from "@nextui-org/react";
import Block from "../ui/block";
import Empty from "../ui/empty";
import { usePreferences } from "@/lib/settings/queries";
import NumberFormat from "@/utils/formatters/currency";

export default function Priority({
  goal,
  limitPayments = 10,
}: {
  goal?: Goal;
  limitPayments?: number;
}) {
  const sum = goal
    ? goal.payments.reduce((prev, { amount }) => prev + amount, 0)
    : 0;

  const percentage = goal ? (sum / goal.price) * 100 : 0;

  return (
    <Block>
      {goal ? (
        <div className="grid gap-6">
          {/* <h3 className="text-3xl font-bold text-center">{goal.title}</h3> */}
          <div className="grid gap-3">
            <div className="flex items-start gap-4 justify-between relative pt-8">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-primary rounded-full h-2.5 w-2.5" />
                  <span className="text-sm">Zebrano</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    <NumberFormat currency={goal.currency} amount={sum} />
                  </span>
                  <span className="text-font/80">{`(${percentage.toFixed(
                    2
                  )}%)`}</span>
                </div>
              </div>
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-center flex flex-col items-center">
                <h2 className="text-font/80">Priorytet</h2>
                <h3 className="font-bold text-lg">{goal.title}</h3>
              </div>
              <div className="flex items-end flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-light border rounded-full h-2.5 w-2.5" />
                  <span className="text-sm">Pozostało</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    <NumberFormat
                      currency={goal.currency}
                      amount={goal.price - sum}
                    />
                  </span>
                  <span className="text-font/80">{`(${(
                    100 - percentage
                  ).toFixed(2)}%)`}</span>
                </div>
              </div>
            </div>
            <Progress
              classNames={{
                track: "border bg-light",
              }}
              value={percentage}
              // valueLabel={percentage.toFixed(2) + "%"}
              // showValueLabel
              // label="Zebrano"
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 pb-2">
              <span className="text-sm font-medium uppercase">Data</span>
              <span className="text-sm font-bold">Wpłaty</span>
              <span className="text-sm font-medium uppercase">Kwota</span>
            </div>
            <ScrollShadow
              className="max-h-48 sm:max-h-[calc(100vh-684px)]"
              hideScrollBar
            >
              <ul>
                {goal.payments.slice(0, limitPayments).map((payment) => (
                  <PaymentRef
                    {...payment}
                    currency={goal.currency}
                    key={`${goal.id}-payment-${payment.date}`}
                  />
                ))}
              </ul>
            </ScrollShadow>
          </div>
        </div>
      ) : (
        <Empty title="Brak priorytetu" />
      )}
    </Block>
  );
}

const PaymentRef = ({
  date,
  amount,
  currency,
}: GoalPayment & Pick<Goal, "currency">) => {
  const { data: preferences } = usePreferences();
  return (
    <li className="py-2 first:pt-0 border-b last:border-b-0 flex items-center justify-between gap-2">
      <span className="text-sm text-font/80">
        {new Intl.DateTimeFormat(preferences?.language.code, {
          dateStyle: "full",
        }).format(new Date(date))}
      </span>
      <span className="text-sm text-font/80">
        <NumberFormat currency={currency} amount={amount} />
      </span>
    </li>
  );
};
