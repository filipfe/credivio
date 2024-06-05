import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  cta?: {
    title: string;
    href: string;
  };
};

export default function Empty({ cta, title }: Props) {
  return (
    <div className="text-center flex-1 justify-center flex flex-col items-center gap-2">
      <p className="text-sm text-font/80">{title}</p>
      {cta && (
        <Link href={cta.href}>
          <Button
            as="div"
            variant="light"
            startContent={<PlusIcon size={14} />}
          >
            {cta.title}
          </Button>
        </Link>
      )}
    </div>
  );
}
