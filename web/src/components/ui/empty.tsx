import { Button, cn } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  cta?: {
    title: string;
    href: string;
    onClick?: () => void;
  };
}

export default function Empty({ cta, title, className }: Props) {
  return (
    <div
      className={cn(
        "text-center flex-1 justify-center flex flex-col items-center gap-3",
        className
      )}
    >
      {title && <p className="text-sm text-font/80">{title}</p>}
      {cta &&
        (cta.onClick ? (
          <Button
            variant="flat"
            radius="md"
            size="sm"
            disableRipple
            startContent={<PlusIcon size={14} />}
            className="bg-light border"
            onPress={cta.onClick}
          >
            {cta.title}
          </Button>
        ) : (
          <Link href={cta.href}>
            <Button
              as="div"
              variant="flat"
              radius="md"
              size="sm"
              disableRipple
              startContent={<PlusIcon size={14} />}
              className="bg-light border"
            >
              {cta.title}
            </Button>
          </Link>
        ))}
    </div>
  );
}
