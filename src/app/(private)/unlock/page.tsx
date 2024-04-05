import Block from "@/components/ui/block";
import { LINKS } from "@/const";
import { createClient } from "@/utils/supabase/server";
import { Button, ButtonGroup, Link } from "@nextui-org/react";
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
    <div className="px-12 pt-8 pb-24 h-full flex flex-col items-center justify-center">
      <Block className="text-center flex flex-col items-center gap-8 max-w-lg w-full !p-20">
        <Icon size={48} strokeWidth={1} />
        <h1 className="text-lg">
          Odblokuj <span className="font-medium">{title}</span> w cenie
        </h1>
        <strong>
          <span className="text-5xl font-semibold">
            {new Intl.NumberFormat("pl-PL", {
              currency: "PLN",
              style: "currency",
            }).format(price)}
          </span>
          <span className="font-normal">/ miesiąc</span>
        </strong>
        <p className="text-sm opacity-60">{description}</p>

        <Link href={`/settings/subscription?selected=${name}`}>
          <Button color="primary" as="div">
            Odblokuj
          </Button>
        </Link>
      </Block>
    </div>
  );
}
