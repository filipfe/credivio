import { Skeleton } from "@nextui-org/react";
import Block from "../ui/block";

export default function Loader({ className }: { className?: string }) {
  return (
    <Block
      className={className}
      title={<Skeleton className="h-7 rounded-full w-full max-w-28" />}
      cta={<Skeleton className="h-5 rounded-full w-full max-w-16" />}
    >
      <Skeleton className="h-9 rounded-full w-full" />
      <Skeleton className="h-5 rounded-full w-full" />
      <Skeleton className="h-5 rounded-full w-full" />
      <Skeleton className="h-5 rounded-full w-full" />
      <Skeleton className="h-5 rounded-full w-full" />
    </Block>
  );
}
