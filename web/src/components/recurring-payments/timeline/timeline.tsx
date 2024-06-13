import Block from "@/components/ui/block";
import { ScrollShadow } from "@nextui-org/react";
import Month from "./month";
import Empty from "@/components/ui/empty";

export default function Timeline({ payments }: { payments: Payment[] }) {
  const grouped: Record<string, Payment[]> = payments.reduce((prev, curr) => {
    const month = new Intl.DateTimeFormat("pl-PL", { month: "long" }).format(
      new Date(curr.issued_at)
    );
    return {
      ...prev,
      [month]: prev[month] ? [...prev[month], curr] : [curr],
    };
  }, {} as Record<string, Payment[]>);
  const months = Object.keys(grouped);
  return (
    <Block
      title="Przeszłe płatności"
      className="row-start-1 row-end-3 col-start-2 col-end-3"
    >
      {months.length > 0 ? (
        <ScrollShadow className="h-[calc(100vh-490px)]" hideScrollBar size={0}>
          <div className="flex flex-col h-full">
            {months.map((month) => (
              <Month key={month} month={month} payments={grouped[month]} />
            ))}
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
