import TimelineProvider from "@/app/(private)/goals/providers";
import { redirect } from "next/navigation";
import Table from "@/components/goals/table";
import List from "@/components/goals/list";
import { createClient } from "@/utils/supabase/server";
import Priority from "@/components/goals/priority";

export default async function Page() {
  const supabase = createClient();
  const { data: goals, error } = await supabase
    .from("goals")
    .select("id, title, description, price, currency, deadline, is_priority")
    .order("deadline")
    .order("created_at");

  if (!error && (!goals || goals.length === 0)) redirect("/goals/add");

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 grid-rows-[max-content_1fr]">
      <TimelineProvider>
        <Table goals={goals} />
        <List goals={goals} />
        <Priority goal={goals.find((goal: Goal) => goal.is_priority)} />
      </TimelineProvider>
    </div>
  );
}
