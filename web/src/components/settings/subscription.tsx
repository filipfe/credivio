import { useState } from "react";
import ActiveService from "./subscription/active";
import ServiceList from "./subscription/list";
import { useServices } from "@/lib/settings/queries";

export default function Subscription() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { data: services, isLoading } = useServices();

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-content-center">
        <l-hatch size={36} stroke={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-2 lg:items-start gap-8">
      {/* <ServiceProvider defaultService={defaultService}> */}
      <ServiceList
        services={services || []}
        selectedService={selectedService}
        changeSelectedService={(id) => setSelectedService(id)}
      />
      <ActiveService
        service={services?.find(({ id }) => id === selectedService)}
      />
      {/* </ServiceProvider> */}
    </div>
  );
}
