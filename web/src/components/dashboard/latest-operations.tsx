import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getLatestOperations } from "@/lib/operations/actions";
import OperationRef from "../operations/ref";
import Block from "@/components/ui/block";
import Empty from "../ui/empty";
import { Coins } from "lucide-react";
import { Dict } from "@/const/dict";

export default async function LatestOperations({
  languageCode,
  dict,
}: {
  languageCode: Locale;
  dict: Dict["private"]["dashboard"]["latest-operations"];
}) {
  const { results: operations } = await getLatestOperations();

  return (
    <Block
      title={dict.title}
      className="xl:col-span-6 !px-0 h-fit"
      titleClassName="px-6 sm:px-10"
    >
      {operations.length > 0 ? (
        <HorizontalScroll fullWidth innerClassName="px-6 sm:px-10">
          {operations.map((operation) => (
            <OperationRef
              languageCode={languageCode}
              payment={operation}
              key={operation.id}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <Empty title={dict._empty} icon={Coins} />
      )}
    </Block>
  );
}
