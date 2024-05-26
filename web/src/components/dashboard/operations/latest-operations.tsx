import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getLatestOperations } from "@/lib/operation/actions";
import Operation from "./ref";

export default async function LatestOperations() {
  const { results: operations } = await getLatestOperations();
  return (
    <HorizontalScroll className="xl:col-span-6">
      {operations.map((operation) => (
        <Operation key={operation.id} operation={operation} />
      ))}
    </HorizontalScroll>
  );
}
