"use client";

import { ServiceContext } from "@/app/(private)/settings/subscription/providers";
import { LINKS } from "@/const";
import { Chip } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";
import { useContext } from "react";

export default function ServiceRef({
  isEnabled,
  ...props
}: Service & { isEnabled: boolean }) {
  const { id, title, description, price, created_at, href } = props;
  const { activeService, setActiveService } = useContext(ServiceContext);
  const link = LINKS.find((item) => item.href === href);
  const Icon = link ? link.icon : <></>;
  const isActive = activeService?.id === id;
  const daysDiff = Math.round(
    Math.abs(new Date(created_at!).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return (
    <button
      onClick={() => setActiveService(props)}
      className={`rounded-md border p-6 flex flex-col items-center gap-2 relative ${
        isActive ? "border-primary text-primary bg-primary/5" : ""
      }`}
    >
      <Icon />
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-sm opacity-80 line-clamp-2">{description}</p>
      {daysDiff < 30 && (
        <Chip
          className="absolute -left-2 -top-2"
          size="sm"
          variant="shadow"
          classNames={{
            base: "bg-gradient-to-br from-primary to-secondary border-small border-white/50 shadow-secondary/30",
            content: "drop-shadow shadow-black text-white",
          }}
        >
          NOWA
        </Chip>
      )}
      {isEnabled && (
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
