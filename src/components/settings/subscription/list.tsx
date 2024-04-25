import Block from "@/components/ui/block";
import { ScrollShadow } from "@nextui-org/react";
import ServiceRef from "./ref";

export default function ServiceList({
  services,
  ownedServices,
}: {
  services: Service[];
  ownedServices: string[];
}) {
  return (
    <Block className="!p-0">
      <ScrollShadow
        className="max-h-[calc(100vh-208px)] px-10 py-8 flex flex-col gap-4"
        hideScrollBar
      >
        <div className="flex items-center gap-4 justify-between mb-2">
          <h2 className="text-lg">Nowe</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {services?.map((service) => (
            <ServiceRef
              {...service}
              isEnabled={ownedServices?.includes(service.id) || false}
              key={service.id}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 justify-between mb-2">
          <h2 className="text-lg">Aktywne</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {services
            .filter((service) => ownedServices?.includes(service.id))
            .map((service) => (
              <ServiceRef
                {...service}
                isEnabled={ownedServices?.includes(service.id) || false}
                key={service.id}
              />
            ))}
        </div>
      </ScrollShadow>
    </Block>
  );
}
