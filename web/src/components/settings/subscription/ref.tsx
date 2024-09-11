import { LINKS } from "@/const";
import { Chip } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";

type Props = {
  service: Service;
  isSelected: boolean;
  changeSelectedService: (id: string) => void;
};

export default function ServiceRef({
  service,
  isSelected,
  changeSelectedService,
}: Props) {
  const { name, title, description, created_at, href, is_active } = service;
  const link = LINKS.find((item) => item.href === href);
  const Icon = link ? link.icon : <></>;
  const daysDiff = Math.round(
    Math.abs(new Date(created_at!).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return (
    <button
      onClick={() => changeSelectedService(name)}
      className={`rounded-md border p-6 max-h-max flex flex-col items-center gap-2 relative ${
        isSelected ? "border-primary text-primary bg-primary/5" : ""
      }`}
    >
      <Icon size={28} />
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-sm opacity-80 line-clamp-2">{description}</p>
      {daysDiff < 30 && (
        <Chip
          className="absolute -left-2 -top-2"
          size="sm"
          variant="shadow"
          classNames={{
            base: "bg-gradient-to-br from-primary to-secondary border-small border-white/50 shadow-secondary/30",
            content: "drop-shadow shadow-black text-white font-medium",
          }}
        >
          NOWA
        </Chip>
      )}
      {is_active && (
        <Chip
          className="absolute -right-2 -top-2"
          size="sm"
          variant="shadow"
          color="primary"
          startContent={<CheckIcon size={14} />}
        >
          Aktywna
        </Chip>
      )}
    </button>
  );
}
