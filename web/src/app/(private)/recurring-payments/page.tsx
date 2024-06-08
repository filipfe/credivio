import ActiveRecurringPaymentsList from "@/components/recurring-payments/active/list";
import Timeline from "@/components/recurring-payments/timeline/timeline";
import Loader from "@/components/stocks/loader";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="px-10 py-4 sm:py-8 flex flex-col h-full gap-6">
      {/* nadchodzace */}
      {/* {payments.length > 0 && (
        <HorizontalScroll>
          {payments.map((payment) => (
            <RecurringPaymentRef key={payment.id} payment={payment} />
          ))}
        </HorizontalScroll>
      )} */}
      <div className="grid grid-cols-2 gap-6">
        <Timeline />
        <Suspense fallback={<Loader />}>
          <ActiveRecurringPaymentsList />
        </Suspense>
      </div>
    </div>
  );
}
