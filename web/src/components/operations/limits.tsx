import Block from "../ui/block";
import Empty from "../ui/empty";
import LimitRef from "../limits/ref";

export default async function Limits() {
  // const { results: limits } = await getLimits()
  const limits: Limit[] = [];
  const daily = limits.find((limit) => limit.period === "daily");
  const weekly = limits.find((limit) => limit.period === "weekly");
  const monthly = limits.find((limit) => limit.period === "monthly");
  return (
    <Block
      // className="col-start-1 col-end-3 row-start-2 row-end-3"
      className="col-span-4 row-start-3 row-end-4"
    >
      <div className="flex flex-col sm:grid grid-cols-3 justify-center">
        <div className="pb-6 sm:pb-0 sm:pr-4 flex flex-col">
          <h4 className="text-sm">Dzień</h4>
          {daily ? (
            <LimitRef {...daily} />
          ) : (
            <Empty
              className="min-h-24"
              cta={{
                title: "Ustaw limit",
                href: "/expenses/limits/add?period=daily",
              }}
            />
          )}
        </div>
        <div className="py-6 border-y sm:border-y-0 sm:py-0 sm:px-4 sm:border-x flex flex-col">
          <h4 className="text-sm">Tydzień</h4>
          {weekly ? (
            <LimitRef {...weekly} />
          ) : (
            <Empty
              className="min-h-24"
              cta={{
                title: "Ustaw limit",
                href: "/expenses/limits/add?period=weekly",
              }}
            />
          )}
        </div>
        <div className="pt-6 sm:pt-0 sm:pl-4 flex flex-col">
          <h4 className="text-sm">Miesiąc</h4>
          {monthly ? (
            <LimitRef {...monthly} />
          ) : (
            <Empty
              className="min-h-24"
              cta={{
                title: "Ustaw limit",
                href: "/expenses/limits/add?period=monthly",
              }}
            />
          )}
        </div>
      </div>
    </Block>
  );
}
