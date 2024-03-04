import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function Add({ type }: { type: "income" | "expense" }) {
  return (
    <Link href={`${type === "expense" ? "/expenses" : "/income"}/add`}>
      <Button color="primary" className="text-sm" variant="light" as="div">
        <PlusIcon size={16} /> Dodaj nowy
      </Button>
    </Link>
  );
}
