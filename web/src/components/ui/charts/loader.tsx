import { Skeleton, cn } from "@nextui-org/react";
import Block from "../block";

type Props = { className?: string; hideTitle?: boolean };

export default function ChartLoader({ className, hideTitle }: Props) {
  return (
    <Block
      className={cn(
        "min-h-48 flex flex-col items-center h-full border-none",
        className
      )}
    >
      {!hideTitle && <Skeleton className="h-5 rounded-full w-1/6 opacity-60" />}
      <div className="relative flex flex-col justify-between h-full border-b border-content2 border-l p-6 flex-1 w-full">
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <Skeleton className="h-px" />
        <div className="absolute inset-y-0 inset-x-6 h-full flex items-end justify-evenly gap-2">
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-5/6" />
          <Skeleton className="flex-1 h-3/5" />
          <Skeleton className="flex-1 h-3/4" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-3/4" />
          <Skeleton className="flex-1 h-5/6" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-3/4" />
          <Skeleton className="flex-1 h-5/6" />
          <Skeleton className="flex-1 h-3/5" />
          <Skeleton className="flex-1 h-1/4" />
          <Skeleton className="flex-1 h-5/6" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-3/4" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-5/6" />
          <Skeleton className="flex-1 h-3/5" />
          <Skeleton className="flex-1 h-3/4" />
          <Skeleton className="flex-1 h-0" />
          <Skeleton className="flex-1 h-0" />
        </div>
      </div>
    </Block>
  );
}
