import { OperationLoader } from "@/components/operations/ref";
import Block from "@/components/ui/block";

export default function Loading() {
  return (
    <div className="px-10 pt-8 pb-24 flex flex-col h-full gap-8">
      <Block title="Bieżące">
        <div className="grid grid-cols-6">
          {Array.from(Array(6)).map((_, k) => (
            <OperationLoader key={k} />
          ))}
        </div>
      </Block>
    </div>
  );
}
