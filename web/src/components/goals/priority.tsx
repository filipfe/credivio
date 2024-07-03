import Block from "../ui/block";
import Empty from "../ui/empty";

export default function Priority({ goal }: { goal?: Goal }) {
  return (
    <Block title="Priorytet">
      {goal ? <></> : <Empty title="Brak priorytetu" />}
    </Block>
  );
}
