import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getLatestOperations } from "@/lib/operations/actions";
import OperationRef from "../operations/ref";
import Block from "@/components/ui/block";

export default async function LatestOperations() {
  const { results: operations } = await getLatestOperations();
  if (operations.length === 0) return;
  return (
    <Block title="Ostatnie operacje" className="xl:col-span-6">
      <div className="-mx-[25px] sm:mx-0">
        <HorizontalScroll innerClassName="px-6 sm:px-0">
          {operations.map((operation) => (
            <OperationRef payment={operation} key={operation.id} />
          ))}
        </HorizontalScroll>
      </div>
    </Block>
  );
}
