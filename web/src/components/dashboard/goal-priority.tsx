import { createClient } from "@/utils/supabase/server";
import Priority from "../goals/priority";

export default async function GoalPriority() {
  const supabase = createClient();
  const { data: goal } = await supabase
    .from("goals")
    .select("title, price, currency, payments:goals_payments(date, amount)")
    .eq("is_priority", true)
    .order("date", { referencedTable: "goals_payments", ascending: false })
    .returns<Goal[]>()
    .single();

  if (!goal) return <></>;

  return (
    <div className="col-span-3 [&>div]:w-full flex items-stretch">
      <Priority goal={goal} limitPayments={5} />
    </div>
  );
}
