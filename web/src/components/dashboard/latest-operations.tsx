import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getLatestOperations } from "@/lib/operations/actions";
import OperationRef from "../operations/ref";
import Block from "@/components/ui/block";

export default async function LatestOperations() {
  const { results: operations } = await getLatestOperations();
  if (operations.length === 0) return;
  return (
    <Block title="Ostatnie operacje" className="xl:col-span-6">
      <HorizontalScroll>
        {operations.map((operation) => (
          <OperationRef {...operation} key={operation.id} />
        ))}
      </HorizontalScroll>
    </Block>
  );
}
