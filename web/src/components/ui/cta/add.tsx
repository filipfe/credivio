import { Button, cn } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function Add({
  title,
  href,
  size = "sm",
  className,
}: {
  title: string;
  href: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}${href}`}>
      <Button
        className={cn("font-medium border", className)}
        size={size}
        as="div"
        radius="md"
        disableRipple
      >
        <PlusIcon size={16} /> {title}
      </Button>
    </Link>
  );
}
