import ActiveRecurringPaymentsList from "@/components/recurring-payments/active/list";
import Upcoming from "@/components/recurring-payments/upcoming/list";
import Timeline from "@/components/recurring-payments/timeline/timeline";
import Loader from "@/components/stocks/loader";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full xl:grid grid-cols-2 grid-rows-[max-content_1fr] gap-6">
      <Suspense fallback={<Loader />}>
        <Upcoming />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <ActiveRecurringPaymentsList searchParams={searchParams} />
      </Suspense>
      <Timeline />
    </div>
  );
}
