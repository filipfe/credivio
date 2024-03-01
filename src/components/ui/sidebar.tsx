import { PAGES } from "@/const";
import NavLink from "./nav-link";
import { SettingsIcon } from "lucide-react";

export default function Sidebar({ isMenuHidden }: { isMenuHidden: boolean }) {
  return (
    <aside className="sticky top-20 max-h-[calc(100vh-80px)] px-4 flex flex-col justify-between pb-4">
      <nav className="space-y-1.5">
        {PAGES.map((link) => (
          <NavLink {...link} hideText={isMenuHidden} key={link.href} />
        ))}
      </nav>
      <NavLink
        title="Ustawienia"
        hideText={isMenuHidden}
        href="/settings"
        icon={SettingsIcon}
      />
    </aside>
  );
}
