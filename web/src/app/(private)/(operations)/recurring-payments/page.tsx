import ActiveRecurringPaymentsList from "@/components/recurring-payments/active/list";
import Upcoming from "@/components/recurring-payments/upcoming/list";
import Timeline from "@/components/recurring-payments/timeline/timeline";
import Loader from "@/components/stocks/loader";
import { Suspense } from "react";
import { getSettings } from "@/lib/general/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { result: settings } = await getSettings();

  if (!settings) {
    throw new Error("Couldn't retrieve settings");
  }

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full xl:grid grid-cols-2 grid-rows-[max-content_1fr] gap-6">
      <Suspense fallback={<Loader />}>
        <Upcoming languageCode={settings.language} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <ActiveRecurringPaymentsList page={searchParams.page} />
      </Suspense>
      <Timeline />
    </div>
  );
}
