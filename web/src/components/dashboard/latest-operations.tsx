import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getLatestOperations } from "@/lib/operations/actions";
import OperationRef from "../operations/ref";
import Block from "@/components/ui/block";

export default async function LatestOperations({
  preferences,
}: {
  preferences: Preferences;
}) {
  const { results: operations } = await getLatestOperations();
  if (operations.length === 0) return;
  return (
    <Block
      title="Ostatnie operacje"
      className="xl:col-span-6 !px-0"
      titleClassName="px-6 sm:px-10"
    >
      <HorizontalScroll fullWidth innerClassName="px-6 sm:px-10">
        {operations.map((operation) => (
          <OperationRef
            preferences={preferences}
            payment={operation}
            key={operation.id}
          />
        ))}
      </HorizontalScroll>
    </Block>
  );
}
