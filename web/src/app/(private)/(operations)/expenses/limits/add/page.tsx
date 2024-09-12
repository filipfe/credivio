import LimitForm from "@/components/limits/form";

export default function Page({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex items-center justify-center">
      <LimitForm
        defaultPeriod={searchParams.period as "daily" | "weekly" | "monthly"}
      />
    </div>
  );
}
