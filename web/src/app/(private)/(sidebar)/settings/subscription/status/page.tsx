import SubscriptionModal from "@/components/dashboard/subscription-modal";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <SubscriptionModal />
    </Suspense>
  );
}
