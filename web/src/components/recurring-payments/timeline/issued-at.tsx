"use client";

import { useSettings } from "@/lib/general/queries";
import { Skeleton } from "@nextui-org/react";

export default function IssuedAt({ issued_at }: Pick<Payment, "issued_at">) {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) return <Skeleton className="h-3 w-12 rounded-full" />;

  return (
    <small className="text-font/80">
      {new Intl.DateTimeFormat(settings?.language, {
        dateStyle: "full",
      }).format(new Date(issued_at))}
    </small>
  );
}
