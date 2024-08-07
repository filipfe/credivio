import Block from "@/components/ui/block";
import { LINKS } from "@/const";
import numberFormat from "@/utils/formatters/currency";
import { createClient } from "@/utils/supabase/server";
import { Button, Link } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: { name?: string };
}) {
  if (!searchParams?.name) redirect("/");
  const supabase = createClient();
  const { data: service } = await supabase
    .from("services")
    .select("title, href, name, description, price")
    .eq("name", searchParams.name)
    .single();
  if (!service) redirect("/");
  const { title, name, description, href, price } = service;
  const link = LINKS.find((item) => item.href === href);
  const Icon = link ? link.icon : <></>;
  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex flex-col items-center justify-center">
      <Block className="text-center flex flex-col items-center gap-8 max-w-lg w-full sm:py-16 py-8 sm:px-12 px-6">
        <Icon size={48} strokeWidth={1} />
        <h1 className="text-lg">
          Odblokuj <span className="font-medium">{title}</span> w cenie
        </h1>
        <strong>
          <span className="text-5xl font-semibold">
            {numberFormat("PLN", price)}
          </span>
          <span className="font-normal">/ miesiąc</span>
        </strong>
        <p className="text-sm opacity-60">{description}</p>

        <Link href={`/settings/subscription?selected=${name}`}>
          <Button disableRipple color="primary" as="div">
            Odblokuj
          </Button>
        </Link>
      </Block>
    </div>
  );
}
