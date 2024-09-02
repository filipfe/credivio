"use client";

import usePreferences from "@/hooks/usePreferences";
import { Skeleton } from "@nextui-org/react";

export default function IssuedAt({ issued_at }: Pick<Payment, "issued_at">) {
  const { data: preferences, isLoading } = usePreferences();

  if (isLoading) return <Skeleton className="h-3 w-12 rounded-full" />;

  return (
    <small className="text-font/80">
      {new Intl.DateTimeFormat(preferences?.language.code, {
        dateStyle: "full",
      }).format(new Date(issued_at))}
    </small>
  );
}
