import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getLatestOperations } from "@/lib/operation/actions";
import OperationRef from "./ref";
import Block from "@/components/ui/block";

export default async function LatestOperations() {
  const { results: operations } = await getLatestOperations();
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
