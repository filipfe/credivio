import { Skeleton } from "@nextui-org/react";
import Block from "../ui/block";

type Props = { className?: string; records?: number };

export default function Loader({ className, records = 4 }: Props) {
  return (
    <Block
      className={className}
      title={<Skeleton className="h-7 rounded-full w-full max-w-28" />}
      cta={<Skeleton className="h-5 rounded-full w-full max-w-16" />}
    >
      <Skeleton className="h-9 rounded-full w-full" />
      {Array.from(Array(records)).map((_, k) => (
        <Skeleton
          className={`h-5 rounded-full w-full ${
            k > 4 ? "hidden sm:block" : ""
          }`}
          key={`loader-${k}`}
        />
      ))}
    </Block>
  );
}
