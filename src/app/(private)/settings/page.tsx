import { SETTINGS_PAGES } from "@/const";
import Link from "next/link";

export default async function Settings() {
  return (
    <div className="px-12 pt-8 pb-24 space-y-8">
      <h1 className="text-3xl">Ustawienia</h1>
      <section className="grid grid-cols-4 gap-y-10 gap-x-6">
        {SETTINGS_PAGES.map((link) => (
          <LinkRef {...link} key={link.href} />
        ))}
      </section>
    </div>
  );
}

function LinkRef({ title, href, icon, description }: SettingsPage) {
  const Icon = icon;
  return (
    <Link
      href={`/settings${href}`}
      className="bg-white rounded-lg px-10 py-8 space-y-4"
    >
      <Icon size={48} />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-font/80">{description}</p>
    </Link>
  );
}
