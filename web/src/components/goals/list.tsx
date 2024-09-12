import Link from "next/link";
import Block from "../ui/block";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import HorizontalScroll from "../ui/horizontal-scroll";
import GoalRef from "./ref";

export default function GoalsList({ goals }: { goals: Goal[] }) {
  return (
    <Block
      title="Bieżące"
      cta={
        <Link href="/goals/add">
          <Button
            as="div"
            variant="light"
            disableRipple
            startContent={<PlusIcon size={14} />}
            className="h-8 bg-light border"
            size="sm"
            radius="md"
          >
            Dodaj
          </Button>
        </Link>
      }
    >
      <HorizontalScroll innerClassName="items-end">
        {goals.map((item) => (
          <GoalRef {...item} key={item.id} />
        ))}
      </HorizontalScroll>
    </Block>
  );
}
