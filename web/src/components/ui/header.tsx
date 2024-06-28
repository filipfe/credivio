import { Fragment, useContext } from "react";
import { signOut } from "@/lib/auth/actions";
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import { AlignJustifyIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import { LINKS, SETTINGS_PAGES } from "@/const";
import { usePathname } from "next/navigation";
import { MenuContext } from "@/app/(private)/providers";

const settingsPage: Page = {
  href: "/settings",
  title: "Ustawienia",
  icon: SettingsIcon,
  links: SETTINGS_PAGES,
};

export default function Header() {
  const { isMenuHidden, setIsMenuHidden } = useContext(MenuContext);
  const pathname = usePathname();
  const flatten = (arr: Page[]): Page[] =>
    arr.flatMap(({ links, ...page }) => [page, ...flatten(links || [])]);
  const links = flatten([...LINKS, settingsPage]).filter(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  );
  return (
    <Fragment>
      <header className="h-20 sticky top-0 bg-white items-center justify-between z-50 px-4 sm:flex hidden">
        <Button
          onPress={() =>
            setIsMenuHidden((prev) => ({ ...prev, desktop: !prev.desktop }))
          }
          className={`rounded-full h-10 w-10 min-w-0 px-0 ml-auto ${
            isMenuHidden.desktop ? "mr-auto" : ""
          }`}
          variant="light"
        >
          <AlignJustifyIcon size={20} />
        </Button>
      </header>
      <header className="flex items-center gap-4 justify-between px-4 sm:px-10 h-16 sm:h-20 fixed sm:sticky top-0 left-0 bg-white z-50 w-full sm:w-auto">
        <Breadcrumbs
          maxItems={3}
          itemsAfterCollapse={1}
          itemsBeforeCollapse={1}
          itemClasses={{
            item: "px-2 flex items-center gap-1.5 sm:gap-2.5 text-[12px] sm:text-[13px] data-[current=true]:font-medium",
            separator: "px-0 sm:px-1",
          }}
        >
          {links.map((link, k, arr) => (
            <BreadcrumbItem
              startContent={
                (arr.length < 3 || k === 0 || k === arr.length - 1) && (
                  <link.icon size={14} />
                )
              }
              key={link.href}
              href={link.href}
            >
              {link.title}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
        <form action={signOut} className="hidden sm:block">
          <button className="py-3 px-6 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-light bg-white">
            <LogOutIcon size={16} />
            Wyloguj
          </button>
        </form>
        <Button
          onPress={() =>
            setIsMenuHidden((prev) => ({ ...prev, mobile: !prev.mobile }))
          }
          className="rounded-full h-10 w-10 min-w-0 px-0 sm:hidden"
          variant="light"
        >
          <AlignJustifyIcon size={20} />
        </Button>
      </header>
    </Fragment>
  );
}
