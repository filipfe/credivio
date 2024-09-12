import ServiceRef from "./ref";

type Props = {
  services: Service[];
  selectedService: string | null;
  changeSelectedService: (id: string) => void;
};

export default function ServiceList({
  services,
  selectedService,
  changeSelectedService,
}: Props) {
  return (
    <div className="flex flex-col gap-4  md:grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {services.map((service) => (
        <ServiceRef
          service={service}
          changeSelectedService={changeSelectedService}
          isSelected={service.name === selectedService}
          key={service.name}
        />
      ))}
    </div>
  );
}
