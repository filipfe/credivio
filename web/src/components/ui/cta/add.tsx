import { Button, cn } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function Add({
  type,
  size = "sm",
  className,
}: {
  type: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${type}s/add`}>
      <Button
        className={cn("font-medium", className)}
        size={size}
        as="div"
        radius="md"
        disableRipple
      >
        <PlusIcon size={16} /> Dodaj
      </Button>
    </Link>
  );
}
