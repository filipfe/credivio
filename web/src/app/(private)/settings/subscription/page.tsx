import Active from "@/components/settings/subscription/active";
import Start from "@/components/settings/subscription/start";
import { getSubscription } from "@/lib/subscription/actions";
import { Suspense } from "react";

export default async function Subscription() {
  const { result: subscription } = await getSubscription();

  const isActive =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  return (
    <div className="flex-1 flex flex-col lg:grid grid-cols-2 gap-6 sm:gap-10">
      <div className="border bg-light rounded-md p-12"></div>
      {isActive ? (
        <Active {...subscription} />
      ) : (
        <Suspense
          fallback={
            <div className="py-12 grid place-content-center">
              <l-hatch size={32} />
            </div>
          }
        >
          <Start />
        </Suspense>
      )}
    </div>
  );
}
