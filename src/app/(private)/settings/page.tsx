import Block from "@/components/ui/block";
import { SETTINGS_PAGES } from "@/const";
import Link from "next/link";

export default async function Settings() {
  return (
    <div className="p-6 sm:px-10 sm:pt-8 sm:pb-24 space-y-8">
      <section className="flex flex-col sm:grid gap-6 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
        {SETTINGS_PAGES.map((link) => (
          <LinkRef {...link} key={link.href} />
        ))}
      </section>
    </div>
  );
}

function LinkRef({ title, href, icon, description }: Page) {
  const Icon = icon;
  return (
    <Link href={href}>
      <Block>
        <Icon size={48} className="hidden sm:block" />
        <Icon size={36} className="sm:hidden" />
        <h3 className="sm:text-lg font-medium">{title}</h3>
        <p className="text-tiny sm:text-sm text-font/80">{description}</p>
      </Block>
    </Link>
  );
}
