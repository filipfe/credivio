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
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .returns<Service[]>();
  if (!services || services.length === 0) {
    redirect("/settings");
  }
  const { data: userServices } = await supabase
    .from("user_services")
    .select("service_id");
  const ownedServices = userServices
    ? userServices.map((item: { service_id: string }) => item.service_id)
    : [];
  const defaultService = services?.find(
    (item: Service) => item.name === searchParams?.selected
  );
  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex flex-col lg:grid grid-cols-2 gap-4 sm:gap-6">
      <ServiceProvider defaultService={defaultService}>
        <ServiceList services={services} ownedServices={ownedServices} />
        <ActiveService ownedServices={ownedServices} />
      </ServiceProvider>
    </div>
  );
}
