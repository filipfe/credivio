import { createClient } from "@/utils/supabase/server";
import ServiceProvider from "./providers";
import { redirect } from "next/navigation";
import ServiceList from "@/components/settings/subscription/list";
import ActiveService from "@/components/settings/subscription/active";

export default async function Page({
  searchParams,
}: {
  searchParams?: { selected?: string };
}) {
  const supabase = createClient();
  const { data: services } = await supabase.from("services").select("*");
  if (!services || services.length === 0) {
    redirect("/settings");
  }
  const { data: userServices } = await supabase
    .from("user_services")
    .select("service_id");
  const ownedServices = userServices?.map((item) => item.service_id);
  const defaultService = services?.find(
    (item) => item.name === searchParams?.selected
  );
  return (
    <div className="px-12 pt-8 pb-24 h-full flex flex-col lg:grid grid-cols-2 gap-8">
      <ServiceProvider defaultService={defaultService}>
        <ServiceList services={services} ownedServices={ownedServices || []} />
        <ActiveService ownedServices={ownedServices || []} />
      </ServiceProvider>
    </div>
  );
}
