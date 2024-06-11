import ActiveRecurringPaymentsList from "@/components/recurring-payments/active/list";
import ComingUp from "@/components/recurring-payments/coming-up/list";
import Timeline from "@/components/recurring-payments/timeline/timeline";
import Loader from "@/components/stocks/loader";
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

async function Operations() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("operations")
    .select("id, title, issued_at")
    .eq("recurring", true)
    .returns<Payment[]>();

  if (error) {
    throw new Error(error.message);
  }

  const now = new Date().getTime();

  const { future, past } = data.reduce(
    (prev, curr) =>
      now < new Date(curr.issued_at).getTime()
        ? { ...prev, future: [...prev.future, curr] }
        : { ...prev, past: [...prev.past, curr] },
    { future: [] as Payment[], past: [] as Payment[] }
  );

  return (
    <Fragment>
      <ComingUp payments={future} />
      <Timeline payments={past} />
    </Fragment>
  );
}
