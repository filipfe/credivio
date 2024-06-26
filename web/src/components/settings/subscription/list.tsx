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
        className="max-h-[calc(100vh-208px)] flex flex-col gap-4 px-6 sm:px-10 pt-5 pb-6 sm:py-8"
        hideScrollBar
      >
        <div className="flex flex-col gap-4 grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
          {services.map((service) => (
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
