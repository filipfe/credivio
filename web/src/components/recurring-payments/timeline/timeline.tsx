import Block from "@/components/ui/block";
import { ScrollShadow } from "@nextui-org/react";
import Month from "./month";
import Empty from "@/components/ui/empty";
import { createClient } from "@/utils/supabase/server";

export default async function Timeline() {
  const supabase = createClient();
  const { data: years } = await supabase
    .rpc("get_recurring_payments_timeline_data", {
      p_offset: 0,
    })
    .returns<Year[]>();

  return (
    <Block
      title="Przeszłe płatności"
      className="row-start-1 row-end-3 col-start-2 col-end-3"
    >
      {years && years.length > 0 ? (
        <ScrollShadow className="h-[calc(100vh-490px)]" hideScrollBar size={0}>
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
