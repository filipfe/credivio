import Block from "../ui/block";
import Empty from "../ui/empty";

export default function Limits() {
  // const limits = [{ type: "daily", amount: 254, currency: "PLN" }];
  const limits = [];
  return (
    <Block
      title="Limity"
      className="col-start-1 col-end-3 row-start-2 row-end-3"
    >
      {limits.length > 0 ? (
        <div className="grid grid-cols-3 gap-6 justify-center"></div>
      ) : (
        <Empty cta={{ title: "Ustaw limit", href: "/expenses/limits/add" }} />
      )}
    </Block>
  );
}
