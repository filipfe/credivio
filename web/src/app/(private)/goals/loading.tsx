import { Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="px-10 pt-8 pb-24 flex flex-col h-full gap-8">
      <div className="grid grid-cols-4 gap-6">
        <Skeleton className="h-48 rounded-md" />
        <Skeleton className="h-48 rounded-md" />
        <Skeleton className="h-48 rounded-md" />
        <Skeleton className="h-48 rounded-md" />
        <Skeleton className="h-48 rounded-md col-span-2" />
        <Skeleton className="h-48 rounded-md col-span-2" />
      </div>
    </div>
  );
}
