import { SETTINGS_PAGES } from "@/const";
import Link from "next/link";

export default async function Settings() {
  return (
    <div className="px-6 sm:px-10 py-4 sm:pt-8 sm:pb-24 space-y-8">
      <section className="flex flex-col gap-4 sm:grid sm:gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
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
    <Link href={href} className="bg-white rounded-lg px-10 py-8 space-y-4">
      <Icon size={48} />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-font/80">{description}</p>
    </Link>
  );
}
