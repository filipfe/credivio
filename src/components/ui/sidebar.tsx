import { LINKS, PAGES } from "@/const";
import NavLink from "./nav-link";
import { SettingsIcon } from "lucide-react";

export default function Sidebar({ isMenuHidden }: { isMenuHidden: boolean }) {
  const links = isMenuHidden ? LINKS : PAGES;
  return (
    <aside className="sticky top-20 max-h-[calc(100vh-80px)] px-4 flex flex-col justify-between pb-4">
      <nav className="flex flex-col gap-3">
        {links.map((group) => (
          <NavLink
            {...group}
            isGroup={!isMenuHidden && !!group.links}
            hideText={isMenuHidden}
            key={group.href}
          />
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
