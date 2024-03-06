import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function Add({ type }: { type: OperationType | "stock" }) {
  return (
    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${type}s/add`}>
      <Button color="primary" className="text-sm" variant="light" as="div">
        <PlusIcon size={16} /> Dodaj nowy
      </Button>
    </Link>
  );
}
