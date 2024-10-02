import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getLatestOperations } from "@/lib/operations/actions";
import OperationRef from "../operations/ref";
import Block from "@/components/ui/block";
import Empty from "../ui/empty";
import { Coins } from "lucide-react";

export default async function LatestOperations({
  preferences,
}: {
  preferences: Preferences;
}) {
  const { results: operations } = await getLatestOperations();

  return (
    <Block
      title="Ostatnie operacje"
      className="xl:col-span-6 !px-0"
      titleClassName="px-6 sm:px-10"
    >
      {operations.length > 0 ? (
        <HorizontalScroll fullWidth innerClassName="px-6 sm:px-10">
          {operations.map((operation) => (
            <OperationRef
              preferences={preferences}
              payment={operation}
              key={operation.id}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <Empty title="Nie znaleziono ostatnich operacji" icon={Coins} />
      )}
    </Block>
  );
}
