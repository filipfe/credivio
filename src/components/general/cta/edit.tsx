import { Button } from "@nextui-org/react";
import { SquarePenIcon } from "lucide-react";
import Link from "next/link";

export default function Edit({
  type,
  id,
  isDisabled,
}: {
  type: string;
  id: string;
  isDisabled?: boolean;
}) {
  return isDisabled ? (
    <Button color="primary" isDisabled className="text-sm" variant="light">
      <SquarePenIcon size={14} /> Edytuj
    </Button>
  ) : (
    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${type}s/edit?id=${id}`}>
      <Button color="primary" className="text-sm" variant="light" as="div">
        <SquarePenIcon size={14} /> Edytuj
      </Button>
    </Link>
  );
}
