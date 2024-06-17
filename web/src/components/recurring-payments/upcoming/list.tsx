import OperationRef from "@/components/operations/ref";
import Block from "@/components/ui/block";
import Empty from "@/components/ui/empty";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { createClient } from "@/utils/supabase/server";
import { PauseIcon } from "lucide-react";

const actions: ActionButtonProps[] = [
  {
    text: "Anuluj",
    icon: PauseIcon,
    onSubmit: async () => {},
  },
];

export default async function Upcoming() {
  const supabase = createClient();
  const { data: payments } = await supabase
    .rpc("get_recurring_payments_upcoming_payments")
    .returns<RecurringPayment[]>();
  return (
    <Block title="Nadchodzące">
      {payments && payments.length > 0 ? (
        <HorizontalScroll>
          {payments.map((payment) => (
            <OperationRef
              payment={{ ...payment, issued_at: payment.next_payment_date }}
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
