import OperationRef from "@/components/operations/ref";
import Block from "@/components/ui/block";
import Empty from "@/components/ui/empty";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { PauseIcon } from "lucide-react";

const actions: ActionButtonProps[] = [
  {
    text: "Anuluj",
    icon: PauseIcon,
    onSubmit: async () => {},
  },
];

export default function ComingUp({ payments }: { payments: Payment[] }) {
  return (
    <Block title="Nadchodzące">
      {payments.length > 0 ? (
        <HorizontalScroll>
          {payments.map((payment) => (
            <OperationRef
              payment={payment}
              actions={actions}
              key={payment.id}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <Empty
          title="Brak nadchodzących płatności!"
          cta={{
            title: "Dodaj płatność cykliczną",
            href: "/recurring-payments/add",
          }}
        />
      )}
    </Block>
  );
}
