import { useState } from "react";
import ActiveService from "./subscription/active";
import ServiceList from "./subscription/list";
import useSWR from "swr";
import { getServices } from "@/lib/settings/queries";

export default function Subscription() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const { data: services, isLoading } = useSWR(
    ["settings", "services"],
    getServices
  );

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-content-center">
        <l-hatch size={36} stroke={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
      {/* <ServiceProvider defaultService={defaultService}> */}
      <ServiceList services={[]} ownedServices={[]} />
      <ActiveService
        service={services?.find(({ id }) => id === activeService)}
      />
      {/* </ServiceProvider> */}
    </div>
  );
}
