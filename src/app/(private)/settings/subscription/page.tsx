import Block from "@/components/ui/block";
import { createClient } from "@/utils/supabase/server";
import ServiceProvider from "./providers";

export default async function Page({
  searchParams,
}: {
  searchParams?: { selected?: string };
}) {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, title, name, href, description, price");
  const defaultService = services?.find(
    (item) => item.name === searchParams?.selected
  );
  return (
    <div className="px-12 pt-8 pb-24 h-full grid grid-cols-2 gap-8">
      <ServiceProvider defaultService={defaultService}>
        <Block className="" title="Usługi">
          <div></div>
        </Block>
        <Block className="">
          <div></div>
        </Block>
      </ServiceProvider>
    </div>
  );
}
