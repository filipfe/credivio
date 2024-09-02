import Block from "@/components/ui/block";
import { ScrollShadow } from "@nextui-org/react";
import Month from "./month";
import Empty from "@/components/ui/empty";
import { getPastRecurringPayments } from "@/lib/recurring-payments/actions";

export default async function Timeline() {
  const { results: years } = await getPastRecurringPayments();

  return (
    <Block
      title="Przeszłe płatności"
      className="row-start-1 row-end-3 col-start-2 col-end-3"
    >
      {years.length > 0 ? (
        <ScrollShadow className="h-[calc(100vh-266px)]" hideScrollBar size={0}>
          <div className="flex flex-col h-full">
            {years
              ? (years as Year[]).map(({ year, months }) =>
                  months.map((month) => (
                    <Month {...month} year={year} key={month.month} />
                  ))
                )
              : []}
          </div>
        </ScrollShadow>
      ) : (
        <Empty
          title="Nie znaleziono historii płatności!"
          cta={{
            title: "Dodaj płatność cykliczną",
            href: "/recurring-payments/add",
          }}
        />
      )}
    </Block>
  );
}
