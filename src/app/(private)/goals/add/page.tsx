import GoalForm from "@/components/goals/form";

export default function Page() {
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <h1 className="text-3xl">Nowy cel</h1>
      <GoalForm />
    </div>
  );
}
