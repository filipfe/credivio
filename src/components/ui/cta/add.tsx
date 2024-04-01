import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function Add({
  type,
  size,
}: {
  type: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${type}s/add`}>
      <Button
        color="primary"
        className="font-medium"
        size={size}
        variant="flat"
        as="div"
      >
        <PlusIcon size={16} /> Dodaj
      </Button>
    </Link>
  );
}
