import ActiveRecurringPaymentsList from "@/components/recurring-payments/active/list";
import ComingUp from "@/components/recurring-payments/coming-up/list";
import Timeline from "@/components/recurring-payments/timeline/timeline";
import Loader from "@/components/stocks/loader";
import groupFuturePast from "@/utils/formatters/group-future-past";
import { createClient } from "@/utils/supabase/server";
import { Fragment, Suspense } from "react";

export default function Page() {
  return (
    <div
      className={`px-10 py-4 sm:py-8 flex flex-col h-full xl:grid grid-cols-2 grid-rows-[max-content_1fr] gap-6`}
    >
      <Suspense>
        <Operations />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <ActiveRecurringPaymentsList />
      </Suspense>
    </div>
  );
}

const sampleFuture: Payment[] = [
  {
    id: "1",
    title: "Przychód",
    amount: 240,
    currency: "PLN",
    issued_at: "2024-06-11",
    type: "income",
  },
  {
    id: "2",
    title: "Przychód",
    amount: 240,
    currency: "PLN",
    issued_at: "2024-06-11",
    type: "income",
  },
  {
    id: "3",
    title: "Przychód",
    amount: 240,
    currency: "PLN",
    issued_at: "2024-06-11",
    type: "income",
  },
  {
    id: "4",
    title: "Przychód",
    amount: 240,
    currency: "PLN",
    issued_at: "2024-06-11",
    type: "income",
  },
];

async function Operations() {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("operations")
    .select("id, title, issued_at, currency, amount")
    .eq("recurring", true)
    .returns<Payment[]>();

  if (error) {
    throw new Error(error.message);
  }

  const { future, past } = groupFuturePast(
    results,
    (payment) => new Date(payment.issued_at)
  );

  return (
    <Fragment>
      <ComingUp payments={sampleFuture} />
      <Timeline payments={past} />
    </Fragment>
  );
}
